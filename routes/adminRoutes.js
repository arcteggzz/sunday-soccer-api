const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

//we no longer need to do "/admin" because it matches /admin already.
router
  .route("/")
  .get(adminController.getAllAdmin)
  .post(adminController.createNewAdmin)
  .patch(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

module.exports = router;
