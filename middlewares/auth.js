const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { CustomErrorHandler } = require("../errors");

const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(
      CustomErrorHandler.UnAuthenticationError("Authentication faliure")
    );
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id, role } = jwt.verify(token, JWT_SECRET);
    const user = { _id, role };
    req.user = user;
    next();
  } catch (error) {
    return next(
      CustomErrorHandler.UnAuthenticationError("Authentication faliure")
    );
  }
};
module.exports = authenticateUser;
