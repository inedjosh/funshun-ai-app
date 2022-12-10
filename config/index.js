const dotenv = require("dotenv");

dotenv.config();

exports.configs = {
  MONGODB_URL: process.env.MONGODB_URL || "",

  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",

  JWT_SECRET: process.env.JWT_SECRET || "",

  FLW_SECRET_KEY: process.env.FLW_SECRET_KEY || "",
  FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY || "",
  SUSCRIPTION_PLAN: process.env.SUSCRIPTION_PLAN || "",

  MAIL_HOST: process.env.MAIL_HOST || "",
  MAIL_PORT: process.env.MAIL_PORT || "",
  MAIL_USERNAME: process.env.MAIL_USERNAME || "",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || "",
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS || "",

  SENDGRID_KEY: process.env.SENDGRID_KEY || "",

  CLIENT_URL: process.env.CLIENT_URL || "",
};
