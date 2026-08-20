const userService = require("../services/user.service");

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user.userId);
        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            statusCode: 200,
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user.userId, req.body);
        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            statusCode: 200,
            data: {
                user,
            }
        });
    }catch (error) {
        console.error(error);
        next(error);
    }
}
module.exports = { getProfile, updateProfile };