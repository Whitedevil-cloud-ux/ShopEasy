const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            minLength: [2, "Category name must contain at least 2 characters"],
            maxLength: [100, "Category name cannot exceed 100 characters"],
        },

        description: {
            type: String,
            required: false,
            trim: true,
            minLength: [10, "Description must contain at least 10 characters"],
            maxLength: [1000, "Description cannot exceed 1000 characters"],
        },

        slug: {
            type: String,
            required: [true, "Category slug is required"],
            trim: true,
            minLength: [2, "Category slug must contain at least 2 characters"],
            maxLength: [100, "Category slug cannot exceed 100 characters"],
            unique: true,
        },
    }
)

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;