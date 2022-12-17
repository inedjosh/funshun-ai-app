const User = require("./../model/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const getErrorMessagesFromArray = require("../helpers/getErrorMessagesFromArray");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const errorHandler = require("../helpers/errorHandler");
const sendMail = require("../services/sendMail");

exports.auth = async (req, res, next) => {
  try {
    // checkfor error
    const errors = validationResult(req);

    // send error message if error found
    if (!errors.isEmpty()) {
      const errorMessages = getErrorMessagesFromArray(errors.array());

      errorHandler(422, errorMessages);
    }

    const email = req.body.email.toLowerCase();

    // check for user
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      // create token
      const token = await jwt.sign(
        { email: userExist.email, _id: userExist._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      const data = {
        email: userExist.email,
        trials: userExist.trials,
        accountType: userExist.accountType,
        _id: userExist._id,
      };

      // send response
      res.status(201).json({
        data: { ...data, token },
        status: "success",
        message: "User found!",
      });
    }

    // if user does not exist create a new account
    if (!userExist) {
      try {
        const user = new User({
          email: email,
        });

        const newUser = await user.save();

        if (newUser) {
          // create token
          const token = await jwt.sign(
            { email: newUser.email, _id: newUser._id },
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
          // await sendMail(email);

          res.status(201).json({
            data: { ...data, token },
            status: "success",
            message: "User created!",
          });
        }
      } catch (error) {
        next(sendErrorMessage(error, 500));
      }
    }
  } catch (error) {
    // catch and throw error message
    next(sendErrorMessage(error, 500));
  }
};
