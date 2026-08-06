require("dotenv").config();

const app = require("./app");
const config = require("./config/config");
const connectDB = require("./database/mongodb");
const logger = require("./utils/logger");

const PORT = config.server.port;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`Server is running on port: ${PORT}`);
        });
    } catch (error) {
        logger.error(error);
    }
};

startServer();