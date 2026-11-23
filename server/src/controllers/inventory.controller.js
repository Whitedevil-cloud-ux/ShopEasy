const inventoryService = require("../services/inventory.service");
const logger = require("../utils/logger");

const adjustInventoryStock = async(req, res, next) => {
    try{
        const { productId, variantId, quantityChange } = req.body;

        const updatedItem = await inventoryService.adjustStock({
            productId,
            variantId,
            quantityChange,
        });

        logger.info("Inventory stock adjusted" ,{
            productId,
            variantId: variantId || null,
            quantityChange,
            updatedStock: updatedItem.stock,
        });

        return res.status(200).json({
            success: true,
            message: "Stock adjusted successfully",
            statusCode: 200,
            data: {
                updatedItem,
            },
        });
    }catch(error) {
        next(error);
    }
};

module.exports = { adjustInventoryStock };