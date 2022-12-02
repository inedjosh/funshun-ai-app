import sendErrorApiResponse from "../responses/sendErrorApiResponse";

export class AppError extends Error {
  constructor(statusCode, message) {
    super();

    const status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    this.statusCode = statusCode;
    this.message = message;
    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this);
  }
}

export const handleAppError = (res, err) => {
  if (err.isOperational) {
    const { statusCode, message, status } = err;

    return sendErrorApiResponse({
      res,
      status,
      statusCode,
      message,
    });
  }

  if (err.name === "TokenExpiredError") {
    return sendErrorApiResponse({
      res,
      status: "TokenExpiredError",
      statusCode: 401,
      message: "Session expired, please login again.",
    });
  }

  if (err.name === "SyntaxError") {
    return sendErrorApiResponse({
      res,
      status: "SyntaxError",
      statusCode: 400,
      message: "Invalid data supplied.",
    });
  }

  logger.error(err.stack);

  return sendErrorApiResponse({
    res,
    status: "error",
    statusCode: 500,
    message: `We encounted a problem, we are currently on it!`,
  });
};
