const express = require("express");

const inventoryController = require("../controllers/inventory.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { inventoryValidator } = require("../validations/inventory.validators");
const validate = require("../middleware/validation.middleware");
const verifyRole = require("../middleware/role.middleware");

const router = express.Router();

router.patch("/adjust", authMiddleware, verifyRole(["admin"]), inventoryValidator, validate, inventoryController.adjustInventoryStock);

module.exports = router;