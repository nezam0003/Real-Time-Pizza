const User = require("../../models/User");
const { CustomErrorHandler } = require("../../errors");

const userController = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id }).select(
    "-password -updatedAt -__v"
  );
  if (!user) {
    return next(
      CustomErrorHandler.BadRequestError(`Can not found user with ID:`)
    );
  }

  res.json(user);
};

module.exports = userController;
