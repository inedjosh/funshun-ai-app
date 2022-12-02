module.exports = ({ res, message, statusCode = 200, data }) => {
  return res.status(statusCode).json({
    status: "success",
    message: message,
    data: data,
  });
};
