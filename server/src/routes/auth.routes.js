const express = require("express");

const authController = require("../controllers/auth.controller");
const { registerValidator } = require("../validations/auth.validators");
const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);

module.exports = router;