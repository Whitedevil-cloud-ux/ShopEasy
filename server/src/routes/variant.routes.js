const express = require("express");

const variantController = require("../controllers/variant.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { variantValidator, updateVariantValidator } = require("../validations/variant.validators");
const validate = require("../middleware/validation.middleware");
const verifyRole = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, verifyRole(["admin"]), variantValidator, validate, variantController.registerVariant);
router.patch("/:id", authMiddleware, verifyRole(["admin"]), updateVariantValidator, validate, variantController.updateVariant);

module.exports = router;