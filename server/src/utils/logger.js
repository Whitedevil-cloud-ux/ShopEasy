const winston = require("winston");
const config = require("../config/config");

const logger = winston.createLogger({
        level: config.logging.level,

        format: winston.format.combine(
            winston.format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.errors({ stack: true }),
            winston.format.json()
    ),

    transports: [
        new winston.transports.Console(),
    ],
});

module.exports = logger;