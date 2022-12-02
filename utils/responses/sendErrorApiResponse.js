module.exports = ({ res, status, message }) => {
  return res.status(404).send({
    status,
    message: message,
    data: {},
  });
};
