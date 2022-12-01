const User = require("./../model/user");

exports.getTotalUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res
      .status(200)
      .json({
        status: "success",
        message: "user stats fetched",
        data: { totalUsers: users.length },
      });
  } catch (error) {
    return res.status(404).json({ status: "error", message: error, data: {} });
  }
};
