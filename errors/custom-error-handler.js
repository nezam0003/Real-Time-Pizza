const { StatusCodes } = require("http-status-codes");

class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(StatusCodes.CONFLICT, message);
  }

  static UnAuthenticationError(message) {
    return new CustomErrorHandler(StatusCodes.UNAUTHORIZED, message);
  }
}

module.exports = CustomErrorHandler;
