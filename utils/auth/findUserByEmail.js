const User = require("../../model/user");
const { findOneFactory } = require("../db/factories");

module.exports = async (userEmail) => {
  const user = await findOneFactory(User, { email: userEmail });

  return user;
};
