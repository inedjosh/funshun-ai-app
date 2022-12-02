import logger from "./logger";

export default (job) => async (data) => {
  try {
    await job(data);
    return Promise.resolve(true);
  } catch (error) {
    logger.error(error);
    return Promise.reject(new Error(error));
  }
};
