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

module.exports = { registerProduct };