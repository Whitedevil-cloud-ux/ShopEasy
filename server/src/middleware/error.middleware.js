const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  logger.error("Request failed", {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    error: err.message,
    stack: err.stack,
  });

  return res.status(err.statusCode || 500).json({
    success: false,
    statusCode,
    message: statusCode == 500 ? "Internal server error" : err.message,
  });
};

module.exports = errorHandler;