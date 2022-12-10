const User = require("./../model/user");

exports.getTotalUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      status: "success",
      message: "user stats fetched",
      data: { totalUsers: users.length },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
