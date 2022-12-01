const express = require("express");

const router = express.Router();

const adminController = require("./../controller/admin");

router.get("/totalusers", adminController.getTotalUsers);

module.exports = router;
