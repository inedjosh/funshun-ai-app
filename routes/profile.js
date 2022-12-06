const express = require("express");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const profileController = require("./../controller/profile");

router.get("/user", isAuth, profileController.getProfile);

module.exports = router;
