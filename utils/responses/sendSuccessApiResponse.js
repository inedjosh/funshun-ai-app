module.exports = (res, message, data) => {
  return res.json({
    status: "success",
    message: message,
    data: data,
  });
};
