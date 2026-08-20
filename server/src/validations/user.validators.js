const { body } = require("express-validator");

const updateProfileValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    body("mobileNumber")
        .optional()
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Please provide a valid Indian mobile number"),

    body("address.street")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Street address cannot exceed 200 characters"),

    body("address.city")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("City cannot exceed 100 characters"),

    body("address.state")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("State cannot exceed 100 characters"),

    body("address.postalCode")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("Postal code cannot exceed 20 characters"),

    body("address.country")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Country cannot exceed 100 characters"),
];

module.exports = { updateProfileValidation };