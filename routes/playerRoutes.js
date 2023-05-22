const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");
// const verifyJWT = require("../middleware/verifyJWT");

router.route("/").get(playerController.getAllPlayers);

// router.use(verifyJWT);
//we no longer need to do "/player" because it matches /players already.
router
  .route("/")
  .post(playerController.createNewPlayer)
  .patch(playerController.updatePlayer)
  .delete(playerController.deletePlayer);

router.route("/:playerId/stats").post(playerController.updatePlayerStats);
router
  .route("/:playerId/goals/:season")
  .patch(playerController.updatePlayerGoals);

router.route("/playerIds").get(playerController.getAllPlayersIds);
router
  .route("/createMultiplePlayers")
  .post(playerController.createMultiplePlayers);

router
  .route("/:season/goals")
  .patch(playerController.updateMultiplePlayerGoals);

router
  .route("/:season/assists")
  .patch(playerController.updateMultiplePlayerAssists);

router
  .route("/:season/cleanSheets")
  .patch(playerController.updateMultiplePlayerCleanSheets);

router
  .route("/:season/yellowCards")
  .patch(playerController.updateMultiplePlayerYellowCards);

router
  .route("/:season/redCards")
  .patch(playerController.updateMultiplePlayerRedCards);

module.exports = router;
