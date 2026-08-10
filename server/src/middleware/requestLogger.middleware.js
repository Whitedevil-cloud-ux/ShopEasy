const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
    const startTime = process.hrtime.bigint();

    res.on("finish", () => {
        const endTime = process.hrtime.bigint();

        const responseTime = Number(endTime - startTime) / 1_000_000;

        logger.info("HTTP request completed", {
            requestId: req.requestId,
            method: req.method,
            url: req.originalUrl, 
            statusCode: res.statusCode,
            responseTime: `${responseTime.toFixed(2)}ms`,
            ip: req.ip,
            userAgent: req.get("user-agent"),
        });
    });

    next();
};

module.exports = requestLogger;