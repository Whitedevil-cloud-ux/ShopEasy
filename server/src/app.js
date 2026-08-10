const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const apiRoutes = require("./routes");
const ApiResponse = require("./utils/ApiResponse");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");
const requestId = require("./middleware/requestId.middleware");
const requestLogger = require("./middleware/requestLogger.middleware");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Request tracking
app.use(requestId);
app.use(requestLogger);

// Routes
app.use("/api/v1", apiRoutes);

// 404 middleware
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;