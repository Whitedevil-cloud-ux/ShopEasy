require("dotenv").config();

const app = require("./app");
const config = require("./config/config");
const { connectDB, disconnectDB } = require("./database/mongodb");
const logger = require("./utils/logger");

const PORT = config.server.port;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`Server is running on port: ${PORT}`);
        });
    } catch (error) {
        logger.error("failed to start server", {
            error: error.message,
            stack: error.stack,
        });

        process.exit(1);
    }
};

const shutdown = async (signal) => {
    logger.info(`Recieved ${signal}. Starting graceful shutdown...`);

    if(!server) {
        await disconnectDB();
        process.exit(0);
    }

    server.close(async () => {
        logger.info("HTTP server closed");

        try {
            await disconnectDB();

            logger.info("Graceful shutdown completed");
            process.exit(0);
        }catch (error) {
            logger.error("Error during graceful shutdown", {
                error: error.message, 
                stack: error.stack,
            });

            process.exit(1);
        }
    });
};

process.on("SIGNINT", () => {
    shutdown("SIGNINT");
});

process.on("SIGTERM", () => {
    shutdown("SIGTERM");
});

startServer();