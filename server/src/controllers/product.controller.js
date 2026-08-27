const productService = require("../services/product.service");
const logger = require("../utils/logger");

const registerProduct = async(req, res, next) => {
    try {
        const product = await productService.createProduct({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
        });

        logger.info("Product created successfully", {
            requestId: req.requestId,
            productId: product.id.toString(),
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            statusCode: 201,
            data: {
                product,
            },
        });
    } catch (error) {
        next(error);
    }
}

const getAllProducts = async(req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        logger.info("Products retrieved successfully", {
            requestId: req.requestId,
            productCount: products.length,
        });

        return res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            statusCode: 200,
            data: {
                products,
            },
        });
    }catch (error) {
        next(error);
    }
}

const getProductById = async(req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);
        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            statusCode: 200,
            data: {
                product,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { registerProduct, getAllProducts, getProductById };