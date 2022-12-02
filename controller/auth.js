const User = require("./../model/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const getErrorMessagesFromArray = require("../helpers/getErrorMessagesFromArray");
const sendErrorApiResponse = require("../utils/responses/sendErrorApiResponse");

exports.auth = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = getErrorMessagesFromArray(errors.array());

    return res.status(404).json({
      status: "failed",
      message: errorMessages,
      data: {},
    });
  }

  const { email } = req.body;

  const userExist = await User.findOne({ email: email });

  if (userExist) {
    const token = await jwt.sign({ userExist }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      status: "success",
      message: "User found successfully",
      data: {
        email: userExist.email,
        _id: userExist._id,
        trials: userExist.trials,
        accountType: userExist.accountType,
        token,
      },
    });
  }

  try {
    const user = new User({
      email: email,
    });

    const response = await user.save();

    const token = await jwt.sign({ userExist }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        email: response.email,
        _id: response._id,
        trials: response.trials,
        accountType: response.accountType,
        token,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Somethign went wrong, could not create user",
      data: {},
    });
  }
};
