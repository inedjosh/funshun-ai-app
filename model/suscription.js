const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const suscriptionSchema = new Schema(
  {
    trx_ref: {
      type: String,
      required: true,
    },
    trx_id: {
      type: String,
      required: true,
    },
    trx_status: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", suscriptionSchema);
