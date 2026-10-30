const express = require("express");

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { productValidator, updateProductValidator, productIdValidator } = require("../validations/product.validators");
const validate = require("../middleware/validation.middleware");
const verifyRole = require("../middleware/role.middleware");
const variantController = require("../controllers/variant.controller");

const router = express.Router();

router.get("/:productId/variants", authMiddleware, productIdValidator, validate, variantController.getProductVariants);
router.post("/", authMiddleware, verifyRole(["admin"]), productValidator, validate, productController.registerProduct);
router.get("/", authMiddleware, productController.getAllProducts);
router.get("/:id", authMiddleware, productController.getProductById);
router.patch("/:id", authMiddleware, verifyRole(["admin"]), updateProductValidator, validate, productController.updateProduct);
router.delete("/:id", authMiddleware, verifyRole(["admin"]), productController.deleteProduct);

module.exports = router;