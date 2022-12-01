const express = require("express");

const router = express.Router();

const image = require("./image");
const auth = require("./auth");
const profile = require("./profile");
const suscription = require("./suscription");
const admin = require("./admin");

router.use("/profie", profile);
router.use("/auth", auth);
router.use("/image", image);
router.use("/subscribe", suscription);
router.use("/admin", admin);

module.exports = router;
