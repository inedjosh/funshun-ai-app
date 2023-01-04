const express = require("express");

const router = express.Router();

const image = require("./image");
const auth = require("./auth");
const profile = require("./profile");
const suscription = require("./suscription");
const admin = require("./admin");
const { testEmail } = require("../controller/test_email");

router.use("/profile", profile);
router.use("/auth", auth);
router.use("/image", image);
router.use("/subscribe", suscription);
router.use("/admin", admin);
router.get("/test_email", testEmail);

module.exports = router;
