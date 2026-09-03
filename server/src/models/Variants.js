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

        attributes: [
            {
                name: {
                    type: String,
                    required: [true, "Attribute name is required"],
                    trim: true,
                    minLength: [2, "Attribute name must contain at least 2 characters"],
                    maxLength: [50, "Attribute name cannot exceed 50 characters"],
                    lowercase: true
                },
                value: {
                    type: mongoose.Schema.Types.Mixed,
                    required: [true, "Attribute value is required"],
                    validate: {
                        validator: function (v) {
                            if (typeof v === 'string') {
                                return v.trim().length > 0;
                            }
                            if (typeof v === 'number') {
                                return Number.isFinite(v);
                            }
                            if (typeof v === 'boolean') {
                                return true;
                            }
                            return false;
                        },
                        message: "Attribute value must be a non-empty string, finite number, or boolean",
                    },
                },
            },
        ],
        validate: {
            validator: function (attributes) {
                if(!Array.isArray(attributes) && attributes.length >= 1) {
                    return false;
                };
                const names = attributes.map(attr => attr.name);
                const uniqueNames = new Set(names);

                return names.length === uniqueNames.size;
            },
            message: "Variant must have at least one attribute",
        },

        price: {
            type: Number,
            required: [true, "Variant price is required"],
            min: [1, "Variant price must be at least 1"],
            validate: {
                validator: Number.isInteger,
                message: "Variant price must be an integer",
            },
        },

        stock: {
            type: Number,
            required: [true, "Variant stock is required"],
            min: [0, "Variant stock cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Variant stock must be an integer",
            },
        },
    }
)

const Variant = mongoose.model("Variant", variantSchema);

module.exports = Variant;