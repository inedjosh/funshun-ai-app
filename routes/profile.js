const express = require("express");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const profileController = require("./../controller/profile");

// get user profile
router.get("/user", isAuth, profileController.getProfile);

// get user details -> suscrition/billing details
router.get("/details", isAuth, profileController.getDetails);

module.exports = router;
