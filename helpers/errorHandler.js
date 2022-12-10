module.exports = (status, err) => {
  const error = new Error(err);
  error.statusCode = status;
  error.data = {};
  throw error;
};
