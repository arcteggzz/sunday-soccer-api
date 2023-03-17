const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

//we no longer need to do "/player" because it matches /players already.
router
  .route("/")
  .get(playerController.getAllPlayers)
  .post(playerController.createNewPlayer)
  .patch(playerController.updatePlayer)
  .delete(playerController.deletePlayer);

module.exports = router;
