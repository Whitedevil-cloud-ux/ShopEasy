const env = require("../config/env");
const jwt = require("jsonwebtoken");

const createToken = (userId, role) => {
    const payload = { 
        userId: userId,
        role: role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: "3d",
    }); 

    return token;
};

module.exports = createToken;