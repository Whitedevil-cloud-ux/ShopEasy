const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const ApiResponse = require("./utils/ApiResponse");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json(
        new ApiResponse(
            200,
            "ShopEasy API is running"
        )
    );
});

module.exports = app;