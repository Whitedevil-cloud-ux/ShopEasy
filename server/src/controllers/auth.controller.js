const authService = require("../services/auth.service");
const logger = require("../utils/logger");

const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobileNumber: req.body.mobileNumber,
        });

        logger.info("User registered successfully", {
            requestId: req.requestId,
            userId: user.id.toString(),
        });

        return res.status(201).json({
            success: true,
            statusCode: 201,
            message: "User registered successfully",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, };