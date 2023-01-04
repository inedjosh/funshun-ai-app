const checkIfStringHasExpired = require("../../helpers/checkIfStringHasExpired");
const { compareString } = require("./hash");

module.exports = async ({ string, dbString, stringExpiryTime }) => {
  const stringMatches = await compareString(string, dbString);
  const hasExpired = checkIfStringHasExpired(stringExpiryTime);

  if (stringMatches && !hasExpired) {
    return true;
  }

  return false;
};
