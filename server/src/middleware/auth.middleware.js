const env = require("../config/env");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const access = req.headers.authorization;
    if(!access) {
        const error = new Error("No token is available in the header.");
        error.statusCode = 401;
        error.code = "TOKEN_NOT_FOUND";

        throw error;
    }

    const token = access.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        error.statusCode = 401;
        error.message = "Invalid or expired token";
        error.code = "TOKEN_INVALID";

        throw error;
    }
}

module.exports = authMiddleware;