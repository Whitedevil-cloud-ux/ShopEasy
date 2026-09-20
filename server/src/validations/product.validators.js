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

    body("variants.*.stock")
    .if(body("type").equals("variable"))
    .isInt({ min: 0 })
    .withMessage("Variant stock must be a non-negative integer (>=0)."),

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

    body("variants")
        .custom((value, { req }) => {
            if(req.body.type === "variable") {
                if(!Array.isArray(value)) {
                    throw new Error("Variants must be an array");
                }

                if(value.length < 1) {
                    throw new Error("Variants cannot be empty");
                }
            }

            if(req.body.type == "simple") {
                if(value !== undefined) {
                    throw new Error("Variants should not be provided for simple products");
                }
            }
           return true;
        }),

    body("variants.*.price")
        .if(body("type").equals("variable"))
        .isInt({ min: 1 })
        .withMessage("Variant price must be a positive integer (>=1)."),

    body("variants.*.sku")
    .if(body("type").equals("variable"))
    .trim()
    .notEmpty()
    .withMessage("Variant SKU is required")
    .isString()
    .withMessage("Variant SKU must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Variant SKU must contain between 2 and 50 characters"),

    body("variants.*.attributes")
    .if(body("type").equals("variable"))
    .isArray({ min: 1 })
    .withMessage("Variant attributes must contain at least 1 item."),

    body("variants.*.attributes.*.name")
    .if(body("type").equals("variable"))
    .trim()
    .notEmpty()
    .withMessage("Attribute name is required")
    .isString()
    .withMessage("Attribute name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Attribute name must contain between 2 and 50 characters"),

    body("variants.*.attributes.*.value")
    .if(body("type").equals("variable"))
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

    body("variants.*.attributes")
    .if(body("type").equals("variable"))
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