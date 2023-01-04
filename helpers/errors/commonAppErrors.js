const { Response } = require("http-status-codez");
const { AppError } = require("../../utils/error/appError");

exports.sendBadRequestError = (errorMessage) => {
  throw new AppError(Response.HTTP_BAD_REQUEST, errorMessage);
};

exports.sendUnProcessableEntityError = (errorMessage) => {
  throw new AppError(Response.HTTP_UNPROCESSABLE_ENTITY, errorMessage);
};

exports.sendUnAuthorizedError = (errorMessage) => {
  throw new AppError(Response.HTTP_UNAUTHORIZED, errorMessage);
};

exports.sendNotFoundError = (errorMessage) => {
  throw new AppError(Response.HTTP_NOT_FOUND, errorMessage);
};

exports.sendInternalServerError = (errorMessage) => {
  throw new AppError(Response.HTTP_INTERNAL_SERVER_ERROR, errorMessage);
};

exports.sendFailError = (errorMessage) => {
  throw new AppError(Response.HTTP_FAILED_DEPENDENCY, errorMessage);
};

exports.serverBusyError = () => {
  throw new AppError(
    503,
    "Server busy at the moment, please try in a short while."
  );
};
