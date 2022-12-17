const fs = require("fs");

const User = require("./../model/user");
const Image = require("./../model/image");
const { validationResult } = require("express-validator");
const getErrorMessagesFromArray = require("../helpers/getErrorMessagesFromArray");

// Open-Ai API
const textToImage = require("./../services/openAi/textToImage");
const imageTransform = require("./../services/openAi/imageTransform");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const errorHandler = require("../helpers/errorHandler");
const formatImage = require("../utils/formatImage");
const { response } = require("express");
const sterilizeImage = require("../utils/sterilizeImage");

exports.textImage = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = getErrorMessagesFromArray(errors.array());

      errorHandler(422, errorMessages);
    }

    const { userId } = req;
    const { text, renders } = req.body;

    const user = await User.findById(userId);

    if (user.trials === 0) {
      errorHandler(422, "You have exceeded the number of trials"); // throw an error if users trials is < 1
    }

    const result = await textToImage(text, renders);

    if (result) {
      //reset users trails < 1
      const newUser = user;

      newUser.trials -= 1;

      await newUser.save();

      const resData = {
        user: newUser,
        url: result,
      };

      // store generated image in DB
      const newImage = new Image({
        userId: userId,
        imageUrl: result,
      });

      await newImage.save();

      return res.status(200).json({
        status: "success",
        message: "image succesfully generated",
        data: resData,
      });
    }
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};

exports.transformImage = async (req, res, next) => {
  try {
    const image = req.file;
    const { userId } = req;

    if (!image) errorHandler(422, "Invalid image or null"); // check for image

    const user = await User.findById(userId);

    if (user.trials === 0)
      errorHandler(422, "You have exceeded the number of trials");

    const formattedImg = formatImage(image.path);
    console.log("image formatted");
    if (formattedImg) {
      const result = await imageTransform();
      console.log("image generated");
      if (result) {
        // reset the users trials on image generation
        const newUser = user;

        newUser.trials -= 1;

        await newUser.save();

        // store generated image in DB
        const newImage = new Image({
          userId: userId,
          imageUrl: result,
        });

        await newImage.save();

        return res.status(200).json({
          msg: "Succesfully generated image",
          status: "success",
          data: {
            user: newUser,
            url: result,
          },
        });
      }
    }
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};

exports.fetchUsersImages = async (req, res, next) => {
  try {
    const { email } = req.query;
    console.log(req.query);
    // find user
    const user = await User.findOne({ email: email });

    if (!user) errorHandler(422, "Authentication failed, please try again");

    const images = await Image.find({ userId: user._id });

    if (images) {
      // return images
      return res.status(200).json({
        status: "success",
        message: "Images fetched successfully",
        data: sterilizeImage(images),
      });
    }
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};

exports.fetchAllImages = async (req, res, next) => {
  try {
    const images = await Image.find();

    if (images) {
      // return images
      return res.status(200).json({
        status: "success",
        message: "Images fetched successfully",
        data: sterilizeImage(images),
      });
    }
  } catch (error) {
    next(sendErrorMessage(error, 500));
  }
};
