const mongoose = require("mongoose");
const Category = require("./Category");

const variantSchema = new mongoose.Schema(
    {
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

        variants: [variantSchema],
    }
)

const Product = mongoose.model("Product", productSchema);

module.exports = Product;