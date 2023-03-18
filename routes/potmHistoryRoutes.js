const express = require("express");
const router = express.Router();
const potmHistoryController = require("../controllers/potmHistoryController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/").get(potmHistoryController.getAllPotmHistory);

router.use(verifyJWT);

router.route("/").post(potmHistoryController.addPotmHistory);

module.exports = router;
