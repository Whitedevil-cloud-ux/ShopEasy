const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");

const createProduct = async({ 
    name, 
    description, 
    price, 
    category 
}) => {
    const existingCategory = await Category.findById(category);
    if(!existingCategory) {
        const error = new Error("Category id not found");
        error.statusCode = 404;
        error.code = "CATEGORY_NOT_FOUND";
        
        throw error;
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
    });

    return {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
    };
};

// Find all products and populate the category field
const getAllProducts = async() => {
    const products = await Product.find().populate("category");
    return products;
};

const getProductById = async(productId) => {
    if(!mongoose.Types.ObjectId.isValid(productId)){
        const error = new Error("Invalid format Id");
        error.statusCode = 400;
        error.code = "INVALID_MONGO_ID_FORMAT";

        throw error;
    }
    const product = await Product.findById(productId).populate("category");
    if(!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        error.code = "PRODUCT_NOT_FOUND";

        throw error;
    }

    return product;
};

const updateProduct = async({ productId, name, description, price, category }) => {
    if(!mongoose.Types.ObjectId.isValid(productId)){
        const error = new Error("Invalid format of Id");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT";

        throw error;
    }
    const product = await Product.findById(productId);
    if(!product){
        const error = new Error("Product not found");
        error.statusCode = 404;
        error.code = "PRODUCT_NOT_FOUND";

        throw error;
    }

    const updateData = {};

    if(name !== undefined){
            updateData.name = name;
    }

    if(description !== undefined){
        updateData.description = description;
    }

    if(price !== undefined){
        updateData.price = price;
    }

    if(category !== undefined){
        const categoryDoc = await Category.findById(category);
        if(!categoryDoc) {
            const error = new Error("Category not found");
            error.statusCode = 404;
            error.code = "CATEGORY_NOT_FOUND";

            throw error;
        }
    }

    if(Object.keys(updateData).length === 0){
        const error = new Error("Update at least one field");
        error.statusCode = 400;
        error.code = "NO_FIELD_UPDATED";

        throw error;
    }

    const newDetails = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    return newDetails;
}
module.exports = { createProduct, getAllProducts, getProductById, updateProduct };
