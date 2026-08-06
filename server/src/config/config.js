require("dotenv").config();

const config = {
  server: {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || "development",
  },

  database: {
    mongoURI: process.env.MONGO_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
};

module.exports = config;