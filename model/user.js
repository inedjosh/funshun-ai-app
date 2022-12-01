const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userShema = new Schema({
  email: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    default: "free",
  },
  trials: {
    type: Number,
    default: 3,
  },
});

module.exports = mongoose.model("User", userShema);
