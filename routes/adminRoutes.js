const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/").get(adminController.getAllAdmin);

router.use(verifyJWT);
//we no longer need to do "/admin" because it matches /admin already.
router
  .route("/")
  .post(adminController.createNewAdmin)
  .patch(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

module.exports = router;
