const env = require("./env");

const config = {
  server: {
    port: env.PORT ,
    environment: env.NODE_ENV,
  },

  database: {
    mongoURI: env.MONGO_URI,
  },

  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
  },

  logging: {
    level: env.LOG_LEVEL,
  }
};

module.exports = config;