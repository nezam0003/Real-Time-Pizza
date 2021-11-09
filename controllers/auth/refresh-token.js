const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { CustomErrorHandler } = require("../../errors");
const RefreshToken = require("../../models/refresh_token");
const User = require("../../models/User");
const {
  JWT_REFRESH_SECRET,
  JWT_REFRESH_TOKEN_LIFE_TIME,
} = require("../../config");

/*********** Refresh Token Controller */
const refreshTokenController = async (req, res, next) => {
  // validate request object
  const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required(),
  });

  const { error } = refreshTokenSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  // find token in Database
  const refreshToken = await RefreshToken.findOne({
    token: req.body.refresh_token,
  });
  if (!refreshToken) {
    return next(CustomErrorHandler.UnAuthenticationError("Invalid token"));
  }

  // verify token
  let userId;
  try {
    const { _id } = await jwt.verify(refreshToken.token, JWT_REFRESH_SECRET);
    userId = _id;
  } catch (error) {
    return next(CustomErrorHandler.UnAuthenticationError("Invalid token"));
  }

  // check for user
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return next(CustomErrorHandler.UnAuthenticationError("user not found"));
  }

  // Generate new token for user

  const token = user.createJWT();
  const refresh_token = user.createJWT(
    JWT_REFRESH_SECRET,
    JWT_REFRESH_TOKEN_LIFE_TIME
  );

  // Database whitelist
  await RefreshToken.create({ token: refresh_token });

  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token, refresh_token });
};

module.exports = refreshTokenController;
