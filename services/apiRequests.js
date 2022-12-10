const axios = require("axios");

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

axios.defaults.timeout = 25000000;

// axios.interceptors.request.use(function (config: AxiosRequestConfig) {
//   const secret_key = configs.SECRET_KEY;
//   config.headers.Authorization = secret_key ? `Bearer ${secret_key}` : "";
//   return config;
// });

exports.getRequest = async ({ endpoint, headers }) => {
  try {
    let response;
    if (headers) {
      response = await axios.request({
        url: endpoint,
        method: "GET",
        headers: { ...headers },
      });
    } else {
      response = await axios.get(endpoint);
    }

    return response;
  } catch (error) {
    logger.error(
      `${error.response.status} ${JSON.stringify(error.response.data)}`
    );
    throw new Error(error.response);
  }
};

exports.postRequest = async ({ endpoint, data, headers }) => {
  try {
    let response;
    if (headers) {
      response = await axios.request({
        url: endpoint,
        method: "POST",
        data: data,
        headers: { ...headers },
      });
    } else {
      response = await axios.post(endpoint, { ...data });
    }

    return response;
  } catch (error) {
    logger.error(
      `${error.response.status} ${JSON.stringify(error.response.data)}`
    );
    throw new Error(error);
  }
};

exports.patchRequest = async ({ endpoint, data }) => {
  try {
    const response = await axios.patch(endpoint, { ...data });
    return response;
  } catch (error) {
    logger.error(
      `${error.response.status} ${JSON.stringify(error.response.data)}`
    );
    throw new Error(error);
  }
};

exports.deleteRequest = async ({ endpoint }) => {
  try {
    const response = await axios.delete(endpoint);
    return response;
  } catch (error) {
    logger.error(
      `${error.response.status} ${JSON.stringify(error.response.data)}`
    );
    throw new Error(error);
  }
};
