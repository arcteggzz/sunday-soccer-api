const express = require("express");
const router = express.Router();
const potmPollController = require("../controllers/potmPollController");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(potmPollController.getAllPollPlayer)
  .patch(potmPollController.updatePollPlayer);

router.use(verifyJWT);

router
  .route("/")
  .post(potmPollController.createNewPollPlayer)
  .delete(potmPollController.deletePollPlayer);

module.exports = router;
