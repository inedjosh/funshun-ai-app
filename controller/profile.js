const User = require("./../model/user");

exports.getProfile = async (req, res) => {
  const { userId } = req;

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found", data: {} });
  }

  return res.status(200).json({
    status: "success",
    data: user,
    message: "User found",
  });
};
