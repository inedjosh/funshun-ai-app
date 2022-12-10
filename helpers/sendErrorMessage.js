module.exports = (error, code) => {
  if (!error.statusCode) {
    error.statusCode = code;
  }
  return error;
};
