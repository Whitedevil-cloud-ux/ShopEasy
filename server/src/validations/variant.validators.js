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

    body("attributes.*.name")
    .trim()
    .notEmpty()
    .withMessage("Attribute name is required")
    .isString()
    .withMessage("Attribute name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Attribute name must contain between 2 and 50 characters"),

    body("attributes.*.value")
        .custom((value) => {
            if (typeof value === "string") {
                if (value.trim().length === 0) {
                    throw new Error("Attribute value cannot be empty");
                }
                return true;
            }

            if (typeof value === "number") {
                if (!Number.isFinite(value)) {
                    throw new Error("Attribute value must be a finite number");
                }
                return true;
            }

            if (typeof value === "boolean") {
                return true;
            }

            throw new Error(
                "Attribute value must be a non-empty string, finite number, or boolean"
            );
        }),

    body("attributes")
        .custom((attributes) => {
            const names = attributes.map(attribute =>
                attribute.name.trim().toLowerCase()
            );

            const uniqueNames = new Set(names);

            if (names.length !== uniqueNames.size) {
                throw new Error("Attribute names must be unique within a variant");
            }

            return true;
        }),

    body("price")
        .isInt({ min: 1 })
        .withMessage("Price must be a positive integer (>=1)."),

    body("stock")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer (>=0)."),

]

module.exports = { variantValidator };