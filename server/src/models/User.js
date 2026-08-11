const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must contain at least 2 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: [255, "Email cannot exceed 255 characters"],
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address",
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must contain at least 8 characters"],
            select: false,
        },

        mobileNumber: {
            type: String,
            required: [true, "Mobile number is required"],
            trim: true,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        address: {
            street: {
                type: String,
                trim: true,
                maxlength: 200,
            },

            city: {
                type: String,
                trim: true,
                maxlength: 100,
            }, 

            state: {
                type: String,
                trim: true,
                maxlength: 100,
            },

            postalCode: {
                type: String,
                trim: true,
                maxlength: 20,
            },

            country: {
                type: String,
                trim: true,
                default: "India",
                maxlength: 100,
            },
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Password hashing
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    }

    const saltRounds = 12;

    this.password = await bcrypt.hash(this.password, saltRounds);
});

// Password comparision
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;