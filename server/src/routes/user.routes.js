const express = require("express");

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const{ updateProfileValidation, updatePasswordValidation } = require("../validations/user.validators");
const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.get("/me", authMiddleware, userController.getProfile);
router.put("/me", authMiddleware, updateProfileValidation, validate, userController.updateProfile);
router.put("/change-password", authMiddleware, updatePasswordValidation, validate, userController.updatePassword);

module.exports = router;