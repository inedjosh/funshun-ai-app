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
    console.log("working...");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = getErrorMessagesFromArray(errors.array());

      errorHandler(422, errorMessages);
    }

    const email = req.body.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      errorHandler(422, "Authentication failed, please try again");
    }

    if (user.accountType === "pro")
      errorHandler(412, "You are suscribed already");

    const userId = user._id.toString();

    const response = await flutterwave.chargeAuthorization({
      email,
      userId,
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
      console.log(transactionDetails);
      if (
        transactionDetails.data.status === "successful" &&
        transactionDetails.data.amount === 2000 &&
        transactionDetails.data.currency === "NGN"
      ) {
        const user = await User.findOne({ email: req.query.email });

        if (!user) {
          errorHandler(422, "Authentication failed, please try again");
        }

        // create suscription record with users ID
        const newSub = new Subscription({
          trx_id: req.query.transaction_id,
          trx_ref: req.query.tx_ref,
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
          trx_ref: req.query.tx_ref,
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

        // Transaction was succesful
        return res.redirect(
          `${configs.CLIENT_URL}/payments?email=${user.email}`
        );
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

exports.deactivateBilling = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    // checkfor user in DB
    if (!user) errorHandler(422, "Authentication failed, please try again!");

    const response = await flw.Subscription.cancel(payload);

    if (response) {
      //** update the user's record on DB  */

      // Set Updated records on user Obj
      user.suscription = "paused";

      // save the user on DB
      await user.save();

      res.status(201).json({
        status: "success",
        message: "billing has been successful paused",
        data: response,
      });
    }
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};

exports.activateBiling = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    // checkfor user in DB
    if (!user) errorHandler(422, "Authentication failed, please try again!");
    const response = await flw.Subscription.activate(payload);

    if (response) {
      //** update the user's record on DB  */

      // Set Updated records on user Obj
      user.suscription = "suscribed";

      // save the user on DB
      await user.save();

      res.status(201).json({
        status: "success",
        message: "billing has been successful resumed",
        data: response,
      });
    }
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) errorHandler(422, "Authentication failed, try again");

    res.status(201).json({
      data: {
        user,
        message: "Payment verified",
        status: "success",
      },
    });
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = getErrorMessagesFromArray(errors.array());

      errorHandler(422, errorMessages);
    }

    const amount = req.body.amount;
    const name = req.body.name;
    const interval = req.body.interval;

    const details = {
      amount,
      name,
      interval,
    };
    flw.PaymentPlan.create(details)
      .then((data) => {
        res.status(201).json({
          data,
          status: "success",
          message: "payment plan succesfully created",
        });
      })
      .catch((error) => next(sendErrorMessage(error, 500)));
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};
