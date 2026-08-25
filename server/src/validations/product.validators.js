const { body } = require("express-validator");

const productValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 100 }),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is mandatory")
        .isLength({ min: 10, max: 1000 }),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isInt({ min: 0 })
        .withMessage("Price must be a non-negative integer"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isMongoId()
        .withMessage("Category must be a valid ID"),
];

module.exports = { productValidator };