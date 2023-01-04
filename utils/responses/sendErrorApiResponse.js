module.exports = ({ res, status, message }) => {
  return res.send({
    status: status,
    message: message,
    data: {},
  });
};
