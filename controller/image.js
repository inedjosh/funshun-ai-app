const fs = require("fs");

const User = require("./../model/user");

// Open-Ai API
const textToImage = require("./../services/openAi/textToImage");
const imageTransform = require("../services/openAi/imageTransform");
const { findByIdAndUpdateFactory } = require("../utils/factories");

exports.textImage = async (req, res) => {
  const { userId } = req;
  const { text } = req.body;

  const user = User.findById(userId);

  if (user.trials < 1) {
    return res.status(404).json({
      status: "failed",
      message: "You have used up your trials",
      data: {},
    });
  }

  try {
    const result = await textToImage(text);

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

exports.transformImage = async (req, res) => {
  const image = req.file;
  const { text } = req.body;
  const { userId } = req;

  const user = User.findById(userId);

  if (user.trials < 1) {
    console.log("exceeded");
    return res.status(404).json({
      status: "failed",
      message: "You have used up your trials",
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
