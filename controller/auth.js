const User = require("./../model/user");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Please enter a valid email address",
      data: {},
    });
  }

  const userExist = await User.findOne({ email: email });

  if (userExist) {
    const token = await jwt.sign({ userExist }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      status: "success",
      message: "User found successfully",
      data: {
        email: userExist.email,
        _id: userExist._id,
        trials: userExist.trials,
        accountType: userExist.accountType,
        token,
      },
    });
  }

  try {
    const user = new User({
      email: email,
    });

    const response = await user.save();

    const token = await jwt.sign({ userExist }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        email: response.email,
        _id: response._id,
        trials: response.trials,
        accountType: response.accountType,
        token,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Somethign went wrong, could not create user",
      data: {},
    });
  }
};
