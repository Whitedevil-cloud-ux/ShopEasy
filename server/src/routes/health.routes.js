const express = require("express");
const ApiResponse = require("../utils/ApiResponse");

const router = express.Router();

router.get("/", (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            "ShopEasy API is running"
        )
    );
});

module.exports = router;