const express = require("express");
const router = express.Router();
const sneakerController = require("../controllers/sneakerController");

router
  .route("/")
  .get(sneakerController.getAllSneakers)
  .post(sneakerController.createNewSneaker)
  .patch(sneakerController.updateSneaker)
  .delete(sneakerController.deleteSneaker);

module.exports = router;
