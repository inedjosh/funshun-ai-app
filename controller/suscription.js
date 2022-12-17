const User = require("./../model/user");
const { validationResult } = require("express-validator");
const getErrorMessagesFromArray = require("../helpers/getErrorMessagesFromArray");
const FlutterwaveApi = require("./../services/flutterwave/index");
const Flutterwave = require("flutterwave-node-v3");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const errorHandler = require("../helpers/errorHandler");
const Subscription = require("./../model/suscription");
const { response } = require("express");
const { configs } = require("../config");

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

const flutterwave = new FlutterwaveApi();
const payload = { id: process.env.SUSCRIPTION_PLAN };

exports.chargeUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = getErrorMessagesFromArray(errors.array());

      errorHandler(422, errorMessages);
    }

    const { email, amount } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      errorHandler(422, "Authentication failed, please try again");
    }

    const userId = user._id.toString();

    const response = await flutterwave.chargeAuthorization({
      email,
      userId,
      amount,
    });

    if (response) {
      res.status(201).json({
        status: "success",
        message: "Link generated",
        data: response,
      });
    }
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};

exports.verifyCharge = async (req, res, next) => {
  try {
    if (req.query.status === "successful") {
      const transactionDetails = await flw.Transaction.verify({
        id: req.query.transaction_id,
      });
      console.log("trx", transactionDetails);
      if (
        transactionDetails.data.status === "successful" &&
        transactionDetails.data.amount === 49.99 &&
        transactionDetails.data.currency === "USD"
      ) {
        console.log(req.query.email);
        const user = await User.findOne({ email: req.query.email });
        console.log(user);
        if (!user) {
          errorHandler(422, "Authentication failed, please try again");
        }

        // create suscription record with users ID
        const newSub = new Subscription({
          trx_id: req.query.transaction_id,
          trx_ref: req.query.trx_ref,
          trx_status: req.query.status,
          userId: user._id,
          issuer: transactionDetails.data.card.issuer,
          country: transactionDetails.data.card.country,
          type: transactionDetails.data.card.type,
          expiry: transactionDetails.data.card.expiry,
          card_first_6digits: transactionDetails.data.card.first_6digits,
          card_last_4digits: transactionDetails.data.card.last_4digits,
          date: new Date(),
        });

        // save the suscription on the DB
        await newSub.save();

        // Set Updated records on user Obj
        user.accountType = "pro";
        user.trials += 200;
        user.suscription = "suscribed";
        user.billing = {
          trx_id: req.query.transaction_id,
          trx_ref: req.query.trx_ref,
          trx_status: req.query.status,
          charge_amount: transactionDetails.data.charged_amount,
          issuer: transactionDetails.data.card.issuer,
          country: transactionDetails.data.card.country,
          type: transactionDetails.data.card.type,
          expiry: transactionDetails.data.card.expiry,
          card_first_6digits: transactionDetails.data.card.first_6digits,
          card_last_4digits: transactionDetails.data.card.last_4digits,
          date: new Date(),
        };
        // save the user on DB
        await user.save();
        console.log("saved user");
        // Transaction was succesful
        return res.json({
          status: "success",
          message: "transaction was successfully verified",
          data: { ...user },
        });
      }
    } else {
      // Inform the customer their payment was unsuccessful
      console.log("something went wrong");
      errorHandler(422, "Something went wrong, could not validate Transaction");
    }
  } catch (error) {
    console.log(error);
    next(sendErrorMessage(error, 500));
  }
};
