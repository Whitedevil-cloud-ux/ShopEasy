const variantService = require("../services/variant.service");
const logger = require("../utils/logger");

const registerVariant = async (req, res, next) => {
    try {
        const variant = await variantService.createVariant({
            productId: req.body.productId,
            sku: req.body.sku,
            attributes: req.body.attributes,
            price: req.body.price,
            stock: req.body.stock,
        });

        logger.info("Variant created successfully", {
            requestId: req.requestId,
            variantId: variant.id.toString(),
        });

        return res.status(201).json({
            success: true,
            message: "Variant created successfully",
            statusCode: 201,
            data: {
                variant,
            },
        });
    } catch (error) {
        next(error);
    }
}

const updateVariant = async(req, res, next) => {
    try {
        const variant = await variantService.updateVariant({
            variantId: req.params.id,
            sku: req.body.sku,
            attributes: req.body.attributes,
            price: req.body.price,
            stock: req.body.stock,
        });

        logger.info("Variant Updated Successfully", {
            requestId: req.requestId,
            variantId: variant.id.toString(),
        });

        return res.status(200).json({
            success: true,
            message: "Variant updated successfully",
            statusCode: 200,
            data: {
                variant,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { registerVariant, updateVariant };