const express = require("express");
const router = express.Router();
const playersController = require("../controllers/playersController");

//we no longer need to do "/player" because it matches /players already.
router
  .route("/")
  .get(playersController.getAllPlayers)
  .post(playersController.createNewPlayer)
  .patch(playersController.updatePlayer)
  .delete(playersController.deletePlayer);

module.exports = router;
