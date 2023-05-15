const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.route("/").get(statsController.getAllPlayerStats);
router.route("/:season").get(statsController.getSingleSeasonPlayerStats);

module.exports = router;
