const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../utils/logger");

const connectDB = async() => {
    try{
        const connection = await mongoose.connect(config.database.mongoURI);
        
        logger.info("MongoDB Connected");
        logger.info(`Database Host: ${connection.connection.host}`);
        logger.info(`Database Name: ${connection.connection.name}`);
    }catch (error) {
        logger.error("MongoDB connection failed");
        logger.error(error.message);

        process.exit(1);
    }
};

module.exports = connectDB;