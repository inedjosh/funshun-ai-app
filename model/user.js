const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userShema = new Schema({
  email: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["free", "pro"],
    default: "free",
  },
  trials: {
    type: Number,
    default: 3,
  },
  suscription: {
    type: String,
    enum: ["unsuscribed", "paused", "suscribed"],
    default: "unsuscribed",
  },
  billing: {
    type: Object,
    default: null,
  },
});

module.exports = mongoose.model("User", userShema);
