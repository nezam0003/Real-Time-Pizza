const Joi = require("joi");
const { CustomErrorHandler } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

/******** Register Controller ******/

const register = async (req, res, next) => {
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
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

/******** Login Controller ******/

const login = async (req, res, next) => {
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
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
