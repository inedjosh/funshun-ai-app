const User = require("./../model/user");

exports.findUser = (userId) => {
  const user = User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found", data: {} });
  }
};
