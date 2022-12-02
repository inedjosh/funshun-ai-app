module.exports = (errorMessagesObject) => {
  const messages = [];

  errorMessagesObject.forEach((obj) => {
    messages.push(obj.msg);
  });

  return messages;
};
