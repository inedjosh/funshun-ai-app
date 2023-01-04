const User = require("./../model/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const getErrorMessagesFromArray = require("../helpers/getErrorMessagesFromArray");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const errorHandler = require("../helpers/errorHandler");
const { generateString } = require("../utils/auth/generateAuthPin");
const { hashString } = require("../utils/auth/hash");
const { sterilizeUserData } = require("../helpers/sterilize");
const checkIfVerificationStringIsValid = require("../utils/auth/checkIfVerificationStringIsValid");
const { configs } = require("../config");
const sendMail = require("../services/sendMail");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = getErrorMessagesFromArray(errors.array());

      //   send badRequestError if error exists in req.Body
      errorHandler(422, errorMessages);
    }

    const newUser = new User({
      email: email,
    });

    if (newUser) {
      // create verification string
      const verificationString = await newUser.generateVerificationString();

      if (!(await newUser.save()))
        return errorHandler(422, "Something went wrong. Please try again!");

      // create token

      const token = await jwt.sign(
        { email: newUser.email, _id: newUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // send mail to the user here
      console.log(verificationString);
      await sendMail({
        email: newUser.email,
        data: {
          link: `${configs.CLIENT_URL}?verificationCode=${verificationString}&email=${newUser.email}`,
        },
        subject: "Verify your account",
        template: "/auth/signup",
      });

      const user = sterilizeUserData(newUser);
      res.status(201).json({
        data: {
          ...user,
          token,
        },
        status: "success",
        message: "User created!",
      });
    }
  } catch (error) {
    // catch and throw error message
    next(sendErrorMessage(error, 500));
  }
};

exports.login = async (req, res, next) => {
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

      // send response
      const user = sterilizeUserData(userExist);
      res.status(201).json({
        data: { ...user, token },
        status: "success",
        message: "User found!",
      });
    }
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};

exports.verifyAccount = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.query;

    if (!email && !verificationCode)
      errorHandler(422, "Invalid request, try again!");

    // find user by email
    const userExist = await User.findOne({ email: email });

    console.log("user-1", userExist);
    if (
      userExist.verificationStringExpiry === null ||
      !userExist.verificationString === null
    )
      return errorHandler(
        422,
        "String is invalid or expired, please try again"
      );

    if (!userExist)
      return errorHandler(422, "Authentication failed, please try again");

    // check if string is valid
    const checkValidity = await checkIfVerificationStringIsValid({
      string: verificationCode,
      dbString: userExist.verificationString,
      stringExpiryTime: userExist.verificationStringExpiry,
    });

    console.log("line 3", userExist);
    if (!checkValidity)
      return errorHandler(
        422,
        "Invalid string provided or expired. Please try again!"
      );

    // validate user
    if (checkValidity) {
      userExist.verified = true;
      userExist.verificationString = null;
      userExist.verificationStringExpiry = null;
      userExist.trials = 3;

      await userExist.save();

      console.log("line 2", userExist);

      return res.status(201).json({
        data: {},
        status: "success",
        message: "User successfully verified",
      });
    }
  } catch (error) {
    // catch and throw error message
    next(sendErrorMessage(error, 500));
  }
};

exports.generateVerifyString = async (req, res, next) => {
  try {
    const { email } = req.query;

    const userExist = await User.findOne({ email: email });

    if (!userExist)
      return errorHandler(422, "Authentication failed, please try again");

    if (userExist) {
      // create verification string
      const verificationString = await userExist.generateVerificationString();

      if (!(await userExist.save()))
        return errorHandler(422, "Something went wrong. Please try again!");

      // send mail to the user here
      await sendMail({
        email: userExist.email,
        data: {
          link: `${configs.CLIENT_URL}?verificationCode=${verificationString}&email=${userExist.email}`,
        },
        subject: "Verify your account",
        template: "/auth/signup",
      });

      return res.status(201).json({
        data: {},
        status: "success",
        message: "Verification link has been successfully sent to your email",
      });
    }
  } catch (error) {
    // catch and throw error message
    next(sendErrorMessage(error, 500));
  }
};
