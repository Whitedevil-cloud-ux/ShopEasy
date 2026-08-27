const express = require("express");

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { productValidator, updateProductValidator } = require("../validations/product.validators");
const validate = require("../middleware/validation.middleware");
const verifyRole = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, verifyRole(["admin"]), productValidator, validate, productController.registerProduct);
router.get("/", authMiddleware, productController.getAllProducts);
router.get("/:id", authMiddleware, productController.getProductById);
router.patch("/:id", authMiddleware, verifyRole(["admin"]), updateProductValidator, validate, productController.updateProduct);

module.exports = router;