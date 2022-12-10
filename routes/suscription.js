const { Router } = require("express");
const express = require("express");
const { check } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const isUser = require("../middleware/is-user");
const router = express.Router();
const suscriptionController = require("./../controller/suscription");

// Generate popup modal link to charge user
router.post(
  "/auth",
  isUser,
  check("email").isEmail().withMessage("Please provide a valid email address."),
  suscriptionController.chargeUser
);

// Get & Verify details of fluttwewave payment
router.get("/auth", suscriptionController.verifyCharge);

// cancel suscription
router.delete("/billing", isUser, suscriptionController.deactivateBilling);

// resume suscription
router.post("/billing", isUser, suscriptionController.activateBiling);

// verify the user on the frontend
router.get("/verify", isAuth, suscriptionController.verifyPayment);

// create payment plan
router.post(
  "/create",
  [
    check("name")
      .isLength({ min: 7 })
      .withMessage("Please provide a valid payment name."),
    check("interval")
      .isLength({ min: 3 })
      .withMessage("Please provide a valid interval/duration."),
    check("amount").isInt().withMessage("Please provide a valid amount"),
  ],
  suscriptionController.createPayment
);

module.exports = router;
