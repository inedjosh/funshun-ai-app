const express = require("express");
const isAuth = require("../middleware/is-auth");
const { check } = require("express-validator");
const router = express.Router();

const {
  transformImage,
  textImage,
  fetchUsersImages,
  fetchAllImages,
} = require("./../controller/image");

//** POST api/image/text */
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

//** POST api/image/transform */
router.post("/transform", isAuth, transformImage);

//** POST api/image/user */
router.get("/user", isAuth, fetchUsersImages);

//** POST api/image/images */
router.get("/images", fetchAllImages);

module.exports = router;
