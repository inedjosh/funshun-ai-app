const express = require("express");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const { transformImage, textImage } = require("./../controller/image");

// text to image route
router.post("/text", isAuth, textImage);

// image transform route
router.post("/transform", isAuth, transformImage);

module.exports = router;
