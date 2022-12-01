const User = require("./../model/user");

exports.upgradeAccount = async (req, res) => {
  const userId = req.query.id;

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found", data: {} });
  }

  return res.status(200).json({
    status: "success",
    data: {
      user: user,
      message: "Account upgrade is been worked on.",
    },
    message: "User found",
  });
};

exports.pauseBilling = async (req, res) => {
  const userId = req.query.id;

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found", data: {} });
  }

  return res.status(200).json({
    status: "success",
    data: {
      user: user,
      message: "Account billing is been worked on.",
    },
    message: "User found",
  });
};

exports.resumeBiling = async (req, res) => {
  const userId = req.query.id;

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found", data: {} });
  }

  return res.status(200).json({
    status: "success",
    data: {
      user: user,
      message: " billing resumption is been worked on.",
    },
    message: "User found",
  });
};

exports.cancelSubscription = async (req, res) => {
  const userId = req.query.id;

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found", data: {} });
  }

  return res.status(200).json({
    status: "success",
    data: {
      user: user,
      message: " billing resumption is been worked on.",
    },
    message: "User found",
  });
};
