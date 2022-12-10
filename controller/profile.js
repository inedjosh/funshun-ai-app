const errorHandler = require("../helpers/errorHandler");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const User = require("./../model/user");

exports.getProfile = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) errorHandler(422, "Authentication failed, please try again");

    return res.status(200).json({
      status: "success",
      data: user,
      message: "User found",
    });
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};

exports.getDetails = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId).populate("billing");

    if (!user) errorHandler(422, "Authentication failed, please try again");

    res.status(201).json({
      data: user,
      message: "user details fetched successfully",
      status: "success",
    });
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};
