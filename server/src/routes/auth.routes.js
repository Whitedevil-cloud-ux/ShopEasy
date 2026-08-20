const express = require("express");

const authController = require("../controllers/auth.controller");
const { registerValidator, loginValidator } = require("../validations/auth.validators");
const validate = require("../middleware/validation.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const verifyRole = require("../middleware/role.middleware");

const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.get("/admin-test", authMiddleware, verifyRole(["admin", "user"]),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "You have admin access",
            user: req.user,
        });
    }
);


module.exports = router;