const { body } = require("express-validator");

const variantValidator = [
    body("productId")
        .trim()
        .notEmpty()
        .withMessage("Product id is required")
        .isMongoId()
        .withMessage("Product id must be a valid id"),

    body("sku")
        .trim()
        .notEmpty()
        .withMessage("SKU is required")
        .isString()
        .withMessage("SKU must be a string")
        .isLength({ min: 2 })
        .withMessage("Minimum length should be at least 2 characters")
        .isLength({ max: 50 })
        .withMessage("Maximum length must not be more than 50 characters"),

    body("attributes")
        .isArray()
        .withMessage("Attributes must be an array")
        .isLength({ min: 1 })
        .withMessage("Attributes must contain at least 1 item"),

    body("price")
        .isInt({ min: 1 })
        .withMessage("Price must be a positive integer (>=1)."),

    body("stock")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer (>=0)."),
]

module.exports = { variantValidator };