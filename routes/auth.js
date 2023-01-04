const express = require("express");
const { check } = require("express-validator");
const signup = require("../controller/auth/signup");

const router = express.Router();

const authController = require("./../controller/auth");

//**  api/auth/signup */
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address."),
    check("firstName")
      .exists()
      .withMessage("Please provide first name.")
      .isLength({ min: 5 })
      .withMessage("Please provide a valid name."),
    check("lastName")
      .exists()
      .withMessage("Please provide last name.")
      .isLength({ min: 5 })
      .withMessage("Please provide a valid name."),
    check("password")
      .exists("Please provide a valid password")
      .isLength({ min: 7 })
      .withMessage("Password must be at least 7 characters."),
  ],
  signup
);

//**  api/auth/login */
router.get("/verify", authController.login);

//**  api/auth/verify */
router.get("/verify", authController.verifyAccount);

//**  api/auth/verify */
router.get("/generate", authController.generateVerifyString);

module.exports = router;
