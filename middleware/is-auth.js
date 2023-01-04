const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedUser;
  try {
    decodedUser = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  console.log(decodedUser);

  if (!decodedUser) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedUser._id;
  req.email = decodedUser.email;
  next();
};
