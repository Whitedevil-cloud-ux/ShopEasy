const express = require("express");

const variantController = require("../controllers/variant.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { variantValidator, updateVariantValidator, variantIdValidator } = require("../validations/variant.validators");
const validate = require("../middleware/validation.middleware");
const verifyRole = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, verifyRole(["admin"]), variantValidator, validate, variantController.registerVariant);
router.patch("/:id", authMiddleware, verifyRole(["admin"]), variantIdValidator, updateVariantValidator, validate, variantController.updateVariant);
router.get("/:id", authMiddleware, variantIdValidator, validate, variantController.getVariantById);

module.exports = router;