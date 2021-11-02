const Joi = require("joi");
const { CustomErrorHandler } = require("../errors");
const User = require("../models/User");
// const bcrypt = require("bcrypt");
const JwtService = require("../services/jwt-service");
const { StatusCodes } = require("http-status-codes");

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

  //   check if user already in database
  //   try {
  //     const isExist = await User.exists({ email: req.body.email });
  //     if (isExist) {
  //       return next(
  //         CustomErrorHandler.alreadyExist(
  //           "Sorry This Email has been Taken, please try another one"
  //         )
  //       );
  //     }
  //   } catch (err) {
  //     return next(err);
  //   }

  /**
   const { name, email, password } = req.body;
  //   hash user password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Make user model
  const userObject = new User({
    name,
    email,
    password: hashedPassword,
  });

  //   save user to database
  let access_token;
  try {
    const user = await userObject.save();
    access_token = JwtService.sign({ userId: user._id, role: user.role });
  } catch (err) {
    return next(err);
  }
   */
};

const login = async (req, res, next) => {
  res.send("login user");
};

module.exports = {
  register,
  login,
};
