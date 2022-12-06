const fs = require("fs");

const User = require("./../model/user");

// Open-Ai API
const textToImage = require("./../services/openAi/textToImage");
const imageTransform = require("../services/openAi/imageTransform");
const { findByIdAndUpdateFactory } = require("../utils/factories");
const sendErrorApiResponse = require("../utils/responses/sendErrorApiResponse");
const sendSuccessApiResponse = require("../utils/responses/sendSuccessApiResponse");

exports.textImage = async (req, res, next) => {
  const { userId } = req;
  const { text } = req.body;

  const user = await User.findById(userId);

  if (user.trials < 1) {
    return res.json({
      status: "failed",
      message: "Sorry, you have used up your trials",
      data: {},
    });
  }

  try {
    const result = await textToImage(text);

    const newUser = await User.findByIdAndUpdate(userId, { trials: -1 });

    const resData = {
      user: newUser,
      url: result,
    };

    return res.json({
      status: "success",
      message: "image succesfully generated",
      data: resData,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      message: error.message,
      data: {},
    });
  }
};

exports.transformImage = async (req, res, next) => {
  const image = req.file;
  const { text } = req.body;
  const { userId } = req;
  console.log(image);
  const user = await User.findById(userId);

  if (user.trials < 1) {
    return res.json({
      status: "failed",
      message: "Sorry, you have used up your trials",
      data: {},
    });
  }

  try {
    const result = await imageTransform(image, text);

    const newUser = await User.findByIdAndUpdate(userId, { trials: -1 });

    res.json({
      msg: "Succesfully generated image",
      status: "success",
      data: {
        user: newUser,
        url: result,
      },
    });
  } catch (error) {
    return res.json({
      status: "failed",
      message: error.message,
      data: {},
    });
  }
};
