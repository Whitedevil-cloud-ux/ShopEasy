const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minLength: [2, "Product name must contain at least 2 characters"],
            maxLength: [100, "Product name cannot exceed 100 characters"],
        },

        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
            minLength: [10, "Product description must contain at least 10 characters"],
            maxLength: [1000, "Product description cannot exceed 1000 characters"],
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Product price cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Product price must be an integer",
            },
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    }
)

const Product = mongoose.model("Product", productSchema);

module.exports = Product;