const Joi = require("joi");
const { CustomErrorHandler } = require("../../errors");
const User = require("../../models/User");
const RefreshToken = require("../../models/refresh_token");
const { StatusCodes } = require("http-status-codes");
const {
  JWT_REFRESH_SECRET,
  JWT_REFRESH_TOKEN_LIFE_TIME,
} = require("../../config");

/******** Register Controller ******/

const registerController = async (req, res, next) => {
  // Validate request
  const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: Joi.ref("password"),
  });

  const { error } = registerSchema.validate(req.body);

  if (error) {
    return next(error);
  }

  const { email } = req.body;
  const isExist = await User.exists({ email });
  if (isExist) {
    return next(
      CustomErrorHandler.alreadyExist(
        "This email has already taken, please try another one"
      )
    );
  }

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  const refresh_token = user.createJWT(
    JWT_REFRESH_SECRET,
    JWT_REFRESH_TOKEN_LIFE_TIME
  );

  // Database whitelist
  await RefreshToken.create({ token: refresh_token });

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token, refresh_token });
};

module.exports = registerController;
