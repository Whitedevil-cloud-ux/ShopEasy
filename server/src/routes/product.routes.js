const express = require("express");

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { productValidator } = require("../validations/product.validators");
const validate = require("../middleware/validation.middleware");
const verifyRole = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, verifyRole(["admin"]), productValidator, validate, productController.registerProduct);

module.exports = router;