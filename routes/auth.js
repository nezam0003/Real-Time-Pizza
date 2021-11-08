const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/auth");
const {
  registerController,
  loginController,
  userController,
  refreshTokenController,
} = require("../controllers/auth");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/user", authenticateUser, userController);
router.post("/refresh-token", refreshTokenController);

module.exports = router;
