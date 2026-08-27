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

module.exports = { createProduct, getAllProducts };
