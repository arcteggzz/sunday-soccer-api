const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/").get(playerController.getAllPlayers);

router.use(verifyJWT);
//we no longer need to do "/player" because it matches /players already.
router
  .route("/")
  .post(playerController.createNewPlayer)
  .patch(playerController.updatePlayer)
  .delete(playerController.deletePlayer);

module.exports = router;
