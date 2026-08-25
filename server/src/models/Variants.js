const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Variant product is required"],
        },

        sku: {
            type: String,
            required: [true, "Variant SKU is required"],
            trim: true,
            minLength: [2, "Variant SKU must contain at least 2 characters"],
            maxLength: [50, "Variant SKU cannot exceed 50 characters"],
        },

        color: {
            type: String,
            required: [true, "Variant color is required"],
            trim: true,
            minLength: [2, "Variant color must contain at least 2 characters"],
            maxLength: [50, "Variant color cannot exceed 50 characters"],
        },

        size: {
            type: String,
            trim: true,
            minLength: [1, "Variant size must contain at least 1 character"],
            maxLength: [10, "Variant size cannot exceed 10 characters"],
        },

        quantity: {
            type: Number,
            required: [true, "Variant quantity is required"],
            min: [0, "Variant quantity cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Variant quantity must be an integer",
            },
        },
    }
)

const Variant = mongoose.model("Variant", variantSchema);

module.exports = Variant;