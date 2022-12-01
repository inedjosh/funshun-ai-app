const mongoose = require("mongoose");
const { configs } = require("../config");

exports.connectDB = () => {
  mongoose
    .connect(configs.MONGODB_URL)
    .then((result) => {
      console.log("DB connection established 🚀");
    })
    .catch((err) => {
      console.log(err);
    });
};
