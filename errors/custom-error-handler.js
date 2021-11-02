class CustomErrorHandler extends Error {
  constructor(status, message) {
    super(status);
    this.message = message;
    this.status = status;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }
}

module.exports = CustomErrorHandler;
