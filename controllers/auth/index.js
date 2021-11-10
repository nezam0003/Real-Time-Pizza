const userController = require("./user");
const registerController = require("./register");
const { loginController, logOutController } = require("./login");
const refreshTokenController = require("./refresh-token");

module.exports = {
  userController,
  registerController,
  loginController,
  refreshTokenController,
  logOutController,
};
