const Joi = require("joi");
const { CustomErrorHandler } = require("../../errors");
const User = require("../../models/User");
const RefreshToken = require("../../models/refresh_token");
const { StatusCodes } = require("http-status-codes");
const {
  JWT_REFRESH_SECRET,
  JWT_REFRESH_TOKEN_LIFE_TIME,
} = require("../../config");

/******** Login Controller ******/
const loginController = async (req, res, next) => {
  // validate request object
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      CustomErrorHandler.UnAuthenticationError("Invalide credential")
    );
  }

  const isCorrectPassword = await user.comparePassword(password);

  if (!isCorrectPassword) {
    return next(
      CustomErrorHandler.UnAuthenticationError("Invalide credential")
    );
  }

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

/******* Logout Controller */

const logOutController = async (req, res, next) => {
  // validate request object
  const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required(),
  });

  const { error } = refreshTokenSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  try {
    await RefreshToken.deleteOne({ token: req.body.refresh_token });
  } catch (error) {
    return next(new Error("Something went wrong"));
  }
  res.status(StatusCodes.OK).json({ msg: "User logout" });
};

module.exports = { loginController, logOutController };
