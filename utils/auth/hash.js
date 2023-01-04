const bcrypt = require("bcrypt");

exports.hashString = async (string) => {
  // generate salt
  const salt = await bcrypt.genSalt(10);
  // hash password
  const hash = await bcrypt.hash(string, salt);

  return hash;
};

exports.compareString = async (plaintextPassword, hashedPassword) => {
  const result = await bcrypt.compare(plaintextPassword, hashedPassword);
  return result;
};
