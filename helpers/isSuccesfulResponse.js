exports.isSuccessfulResponse = (response) => {
  console.info(
    `Method: ${response.config.method}, URL: ${response.config.url}`
  );
  console.info(
    `API Response - status: ${response.status}; statusText: ${response.statusText}; message: ${response.data.message}`
  );
  if (`${response.status}`.startsWith("2") && response.data.status !== false)
    return true;
  return false;
};
