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
        logger.error("MongoDB connection failed", {
            error: error.message,
            stack: error.stack,
        });

        throw error;
    }
};

const disconnectDB = async() => {
    try {
        await mongoose.connection.close();

        logger.info("MongoDB connection closed");
    }catch(error){
        logger.error("MongoDB shutdown failed", {
            error: error.message,
            stack: error.stack,
        });

        throw error;
    }
};

module.exports = { connectDB, disconnectDB };