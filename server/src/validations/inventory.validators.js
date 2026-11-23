const { body } = require("express-validator");

const inventoryValidator = [
    body("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID format"),

    body("variantId")
        .optional()
        .isMongoId()
        .withMessage("Invalid Variant ID format"),

    body("quantityChange")
        .notEmpty()
        .withMessage("Quantity change cannot be empty")
        .custom((value ) => {         
            if(!Number.isInteger(value) || value === 0){
                throw new Error("Quantity Change must be a non-zero integer");
            }
            return true;
        }),
];

module.exports = { inventoryValidator };