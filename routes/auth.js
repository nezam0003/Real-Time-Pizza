const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/auth");
const {
  registerController,
  loginController,
  userController,
  refreshTokenController,
  logOutController,
} = require("../controllers/auth");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/user", authenticateUser, userController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", authenticateUser, logOutController);

module.exports = router;
