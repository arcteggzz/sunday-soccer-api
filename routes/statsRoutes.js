const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.route("/").get(statsController.getAllPlayerStats);

module.exports = router;
