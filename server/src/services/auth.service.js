const User = require("../models/User");

const registerUser = async ({
    name,
    email,
    password,
    mobileNumber,
}) => {
    const existingUser = await User.findOne({ email });

    if(existingUser) {
        const error = new Error("An account with this email already exists");
        error.statusCode = 409;
        error.code = "EMAIL_ALREADY_EXISTS";

        throw error;
    }

    const user = await User.create({
        name, 
        email,
        password,
        mobileNumber,
        role: "user",
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
    };
};

module.exports = { registerUser, };