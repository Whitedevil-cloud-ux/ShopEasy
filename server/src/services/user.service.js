const User = require("../models/User");
const bcrypt = require("bcrypt");

const getProfile = async (userId) => {
    const user = await User.findById(userId);
    if(!user) {
        const error = new Error("No user has been found");
        error.statusCode = 404;
        error.code = "NOT_FOUND";

        throw error;
    }

    return user;
};

const updateProfile = async (userId, updates) => {
    const user = await User.findById(userId);
    if(!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        error.code = "NOT_FOUND";

        throw error;
    }
    const allowedUpdates = {};
    if(updates.name) allowedUpdates.name = updates.name;
    if(updates.mobileNumber) allowedUpdates.mobileNumber = updates.mobileNumber;
    
    Object.assign(user, allowedUpdates);

    if (updates.address) {
        user.address = {
            ...(user.address || {}),
            ...updates.address,
        };
    }

    await user.save();

    return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select("+password");
    if(!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        error.code = "NOT_FOUND";

        throw error;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if(!isPasswordValid) {
        const error = new Error("Oops, you have entered the wrong password. Please try again.");
        error.statusCode = 401;
        error.code = "INVALID_PASSWORD";

        throw error;
    }

    user.password = newPassword;

    await user.save();

    return user;
}

module.exports = { getProfile, updateProfile, changePassword };