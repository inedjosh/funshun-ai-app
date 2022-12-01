const fs = require("fs");

const User = require("./../model/user");

// Open-Ai API
const openai = require("./../index");

exports.textImage = async (req, res) => {
  const { text } = req.body;
  const userId = req.body.id;
  console.log(req.body);
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
      data: {},
    });
  }

  if (user.trials === 0) {
    return res.status(400).json({
      status: "error",
      message: "You have used up your trials",
      data: {},
    });
  }

  try {
    const response = await openai.openai.createImage({
      prompt: text,
      n: 1,
      size: "1024x1024",
    });

    user.trials = user.trials - 1;

    const newUser = await user.save();

    res.status(201).json({
      status: "success",
      message: "image generated successfully",
      data: { url: response.data.data[0].url, user: newUser },
    });
  } catch (error) {
    if (error.response) {
      return res.status(400).json({
        status: "error",
        message: error.response,
        data: {},
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: error.message,
        data: {},
      });
    }
  }
};

exports.transformImage = async (req, res) => {
  const image = req.file;
  const { imgDescription } = req.body;
  const userId = req.body.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
      data: {},
    });
  }

  if (user.trials === 0) {
    return res.status(400).json({
      status: "error",
      message: "You have used up your trials",
      data: {},
    });
  }

  try {
    const response = await openai.openai.createImageEdit(
      fs.createReadStream(image.path),
      fs.createReadStream(image.path),
      imgDescription,
      1,
      "1024x1024"
    );

    user.trials = user.trials - 1;

    const newUser = await user.save();

    res.json({
      status: "success",
      message: "image transformed successfully",
      data: { url: response.data.data[0].url, user: newUser },
    });
  } catch (error) {
    if (error.response) {
      return res.status(400).json({
        status: "error",
        message: error.response,
        data: {},
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: error.message,
        data: {},
      });
    }
  }
};
