module.exports = (stringExpiryTime) => {
  const now = Date.now();
  const stringDate = new Date(stringExpiryTime).getTime();

  if (stringDate < now) {
    return true;
  }

  return false;
};
