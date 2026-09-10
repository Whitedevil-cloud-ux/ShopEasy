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
        .isLength({ min: 10 })
        .withMessage("Length should be more than 10 characters")
        .isLength({ max: 1000 })
        .withMessage("Length cannot exceed 1000 characters"),

    body("type")
        .notEmpty()
        .withMessage("Product type is required")
        .isIn(["simple", "variable"])
        .withMessage("Type must be either 'simple' or 'variable' "),

    body("price")
        .custom((value, { req }) => {
            if (req.body.type === "simple") {
                if(value === undefined || value === null) {
                    throw new Error("Price is required");
                }
                if (!Number.isInteger(value)) {
                        throw new Error("Price must be an integer");
                }
                if(value < 1) {
                    throw new Error("Price must be greater than or equal to 1");
                }
            }
            if (req.body.type === "variable") {
                if (value !== undefined) {
                    throw new Error("Price should not be provided for variable products");
                }
            }
            return true;
        }),

    body("stock")
        .custom((value, { req }) => {
            if(req.body.type === "simple") {
                if(value === undefined || value === null) {
                    throw new Error("Stock is required");
                }
                if(!Number.isInteger(value)){
                    throw new Error("Stock must be an integer");
                }
                if(value < 0) {
                    throw new Error("Stock must be non-negative");
                }
            }
            if(req.body.type === "variable") {
                if(value !== undefined) {
                    throw new Error("Stock should not be provided for variable products");
                }
            }
            return true;
        }),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isMongoId()
        .withMessage("Category must be a valid ID"),
];

const updateProductValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must contain between 2 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage("Description should be at least 10 characters")
        .isLength({ max: 1000 })
        .withMessage("Description should not be more than 1000 characters"),

    body("price")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Price must be a non-negative integer"),

    body("category")
        .optional()
        .isMongoId()
        .withMessage("Category must be valid Id"),
]

module.exports = { productValidator, updateProductValidator };