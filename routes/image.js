const express = require("express");
const isAuth = require("../middleware/is-auth");
const { check } = require("express-validator");
const router = express.Router();

const { transformImage, textImage } = require("./../controller/image");

// text to image route
router.post(
  "/text",
  isAuth,
  [
    check("text")
      .isLength({ min: 10 })
      .withMessage("Please provide a valid image description."),
    check("renders").isInt().withMessage("Please set the number of renders"),
  ],
  textImage
);

// image transform route
router.post("/transform", isAuth, transformImage);

module.exports = router;
