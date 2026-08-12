const User = require("../models/User");
const bcrypt = require("bcrypt");
const createToken = require("../utils/jwt");

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

const loginUser = async({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");
    if(!user) {
        const error = new Error("Sorry, we are unable to find the account using this email.");
        error.statusCode = 404;
        error.code = "EMAIL_NOT_FOUND";

        throw error;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        const error = new Error("Oops, you have entered the wrong password. Please try again.");
        error.statusCode = 401;
        error.code = "INVALID_PASSWORD";

        throw error;
    }

    const token = createToken(user._id, user.role);
    
    return {
        id: user._id,
        email: user.email,
        role: user.role,
        token: token,
    };
}

module.exports = { registerUser, loginUser };