const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const authController = require("./../controller/auth");

//**  api/auth/signup */
router.post(
  "/signup",
  check("email").isEmail().withMessage("Please provide a valid email address."),
  authController.auth
);

module.exports = router;
