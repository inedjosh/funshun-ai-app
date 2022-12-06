const User = require("./../model/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const getErrorMessagesFromArray = require("../helpers/getErrorMessagesFromArray");
const sendErrorApiResponse = require("../utils/responses/sendErrorApiResponse");
const sendSuccessApiResponse = require("../utils/responses/sendSuccessApiResponse");

exports.auth = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = getErrorMessagesFromArray(errors.array());

    next(sendErrorApiResponse(res, "failed", errorMessages));
  }

  const { email } = req.body;

  const userExist = await User.findOne({ email: email });

  if (userExist) {
    const token = await jwt.sign({ userExist }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const data = {
      email: userExist.email,
      _id: userExist._id,
      trials: userExist.trials,
      accountType: userExist.accountType,
      token,
    };

    next(sendSuccessApiResponse(res, "user found successfully", data));
  }

  if (!userExist) {
    try {
      const user = new User({
        email: email,
      });

      const response = await user.save();

      const token = await jwt.sign({ userExist }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const data = {
        email: response.email,
        _id: response._id,
        trials: response.trials,
        accountType: response.accountType,
        token,
      };
      next(sendSuccessApiResponse(res, "user found successfully", data));
    } catch (error) {
      next(
        sendErrorApiResponse(
          res,
          "failed",
          "Somethign went wrong, could not create user"
        )
      );
    }
  }
};
