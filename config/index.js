const dotenv = require("dotenv");

dotenv.config();

exports.configs = {
  MONGODB_URL: process.env.MONGODB_URL || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
};
