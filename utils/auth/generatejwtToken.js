const jwt = require("jsonwebtoken");
const { configs } = require("../../config");

exports.createToken = async (user) => {
  console.log(user);
  const token = await jwt.sign({ user }, configs.JWT_SECRET, {
    expiresIn: configs.JWT_EXPIRY,
  });
  return token;
};

exports.verifyToken = async (token) => {
  const verifiedToken = await jwt.verify(token, configs.JWT_SECRET);

  return verifiedToken;
};
