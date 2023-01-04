const { Router } = require("express");
const express = require("express");
const { check } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const suscriptionController = require("./../controller/suscription");

//** POST api/subscribe/auth */
router.post(
  "/auth",
  isAuth,
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address."),
    check("amount")
      .custom((val) => val === 49.99 || val === 10)
      .withMessage("Please seelct a valid payment option"),
  ],

  suscriptionController.chargeUser
);

//** GET  api/subscribe/verify */
router.get("/verify", isAuth, suscriptionController.verifyCharge);

module.exports = router;
