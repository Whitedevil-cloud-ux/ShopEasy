const express = require("express");

const authController = require("../controllers/auth.controller");
const { registerValidator, loginValidator } = require("../validations/auth.validators");
const validate = require("../middleware/validation.middleware");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.get("/me", authMiddleware, authController.getMe);


module.exports = router;