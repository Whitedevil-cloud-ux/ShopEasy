const User = require("../models/User");

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

module.exports = { getProfile, updateProfile };