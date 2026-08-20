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

module.exports = { getProfile };