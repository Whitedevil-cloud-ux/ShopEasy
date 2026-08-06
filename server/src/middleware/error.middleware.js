const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  return res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};

module.exports = errorHandler;