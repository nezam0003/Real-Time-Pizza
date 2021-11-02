require("dotenv").config();

const { PORT, JWT_SECRET, MONGO_URI, JWT_LIFE_TIME } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  MONGO_URI,
  JWT_LIFE_TIME,
};
