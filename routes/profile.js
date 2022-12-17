const express = require("express");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const profileController = require("./../controller/profile");

//** GET api/profile/user */
router.get("/user", isAuth, profileController.getProfile);

//** GET  api/profile/details */
router.get("/details", isAuth, profileController.getDetails);

module.exports = router;
