const mongoose = require("mongoose");
const { configs } = require("../config");
const { generateString } = require("../utils/auth/generateAuthPin");
const { hashString } = require("../utils/auth/hash");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationString: String,
  accountType: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
  },
  trials: {
    type: Number,
    default: 0,
  },
  billing: {
    type: Object,
    default: null,
  },
  images: {
    type: Schema.Types.ObjectId,
    ref: "Images",
  },

  verificationStringExpiry: Date,
});

userSchema.methods.generateVerificationString = async function () {
  const string = generateString();

  //encrypt string and save to DB
  this.verificationString = await hashString(string);

  // save otp expiry date to DB
  this.verificationStringExpiry =
    Date.now() + 1000 * 60 * parseInt(configs.VERIFCATION_TIME_EXPIRY_MINUTES);

  return string;
};

module.exports = mongoose.model("User", userSchema);
