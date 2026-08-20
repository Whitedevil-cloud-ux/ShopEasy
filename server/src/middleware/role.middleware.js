const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        const role = req.user.role;
        if(!role){
            const error = new Error("No role has been assigned");
            error.statusCode = 403;
            error.code = "ROLE_NOT_ASSIGNED";

            throw error;
        }

        if(!allowedRoles.includes(role)){
            const error = new Error("You are not allowed to access this resource");
            error.statusCode = 403;
            error.code = "FORBIDDEN";

            throw error;
        }
        next();
    };
};

module.exports = verifyRole;