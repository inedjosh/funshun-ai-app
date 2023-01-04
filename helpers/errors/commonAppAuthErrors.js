const {
  sendInternalServerError,
  sendUnAuthorizedError,
  sendBadRequestError,
} = require("./commonAppErrors");

exports.sendProvideEmailError = () => {
  sendBadRequestError("Please provide user's email");
};

exports.sendProvideEmailAndPasswordError = () => {
  sendBadRequestError("Please provide email and password");
};

exports.sendProvideSignupDetailsError = () => {
  sendBadRequestError("Please provide all neccesary information");
};

exports.sendUserAccountNotAvailableError = () => {
  sendBadRequestError(
    "You don't have an account on this platform, please proceed to signup"
  );
};

exports.sendInvalidOtpError = () => {
  sendBadRequestError("Invalid OTP or OTP has expired");
};

exports.sendInvalidLoginCredentialsError = () => {
  sendBadRequestError("Invalid login credentials");
};

exports.sendUserAccountNotActiveError = () => {
  sendUnAuthorizedError(
    "Hello! please proceed to activate your account or contact admin for assistance"
  );
};

exports.sendRequestCouldNotBeCompletedError = () => {
  sendInternalServerError("Request could not be completed please try again!");
};

exports.sendUserExistError = () => {
  sendBadRequestError("Account already exists, proceed to login");
};
