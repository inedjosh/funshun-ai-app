const User = require("./../model/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const getErrorMessagesFromArray = require("../helpers/getErrorMessagesFromArray");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const errorHandler = require("../helpers/errorHandler");
const sendMail = require("../services/sendMail");

exports.auth = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = getErrorMessagesFromArray(errors.array());

      errorHandler(422, errorMessages);
    }

    const email = req.body.email.toLowerCase();

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      const token = await jwt.sign({ userExist }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const data = {
        email: userExist.email,
        trials: userExist.trials,
        accountType: userExist.accountType,
        _id: userExist._id,
      };

      res.status(201).json({
        data: { ...data, token },
        status: "success",
        message: "User found!",
      });
    }

    if (!userExist) {
      try {
        const user = new User({
          email: email,
        });

        const response = await user.save();

        const token = await jwt.sign(
          { userExist: user },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        const data = {
          email: user.email,
          trials: user.trials,
          accountType: user.accountType,
          _id: user._id,
        };

        // send mail to the user here
        await sendMail(email);

        res.status(201).json({
          data: { ...data, token },
          status: "success",
          message: "User created!",
        });
      } catch (error) {
        next(sendErrorMessage(error, 500));
      }
    }
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};
