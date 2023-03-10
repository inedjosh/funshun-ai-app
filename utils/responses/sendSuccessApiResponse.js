module.exports = ({ res, message, statusCode = 201, data }) => {
  return res.status(statusCode).json({
    status: "success",
    message: message,
    data: data,
  });
};
