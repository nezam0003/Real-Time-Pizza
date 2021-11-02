const { StatusCodes } = require("http-status-codes");
const { ValidationError } = require("joi");
const { CustomErrorHandler } = require("../errors");

const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later...",
  };

  if (err instanceof ValidationError) {
    (customError.statusCode = 400), (customError.msg = err.message);
  }

  if (err instanceof CustomErrorHandler) {
    (customError.statusCode = err.status), (customError.msg = err.message);
  }

  return res.status(customError.statusCode).json({ err: err.message });
};

module.exports = errorHandler;
