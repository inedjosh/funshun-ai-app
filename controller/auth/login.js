const asyncHandler = require("../../utils/asyncHandler");
const {
  sendProvideEmailAndPasswordError,
  sendUserAccountNotAvailableError,
  sendInvalidLoginCredentialsError,
} = require("../../helpers/errors/commonAppAuthErrors");
const { compareString } = require("../../utils/Auth/hash");
const sendSuccessApiResponse = require("../../utils/responses/sendSuccessApiResponse");
const findUserByEmail = require("../../utils/Auth/findUserByEmail");
const { createToken } = require("../../utils/Auth/generatejwtToken");
const { sterilizeUserObj } = require("../../helpers/sterilizers");

module.exports = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // if no email or password is missing
  if (!email || !password) next(sendProvideEmailAndPasswordError());

  // check for user in Db
  const userExist = await findUserByEmail(email);

  //   if user not found return sendUserAccountNotAvailableError
  if (!userExist) next(sendUserAccountNotAvailableError());

  // compare passwords
  const validatePassword = await userExist.isValidPassword(
    password,
    userExist.password
  );

  // if password is incorrect sendInvalidLoginCredentialsError
  if (!validatePassword) next(sendInvalidLoginCredentialsError());

  if (validatePassword) {
    // login details are valid
    // create token and send response

    const token = await createToken({
      id: userExist._id,
      email: userExist.email,
    });

    //   check if token is created
    if (token) {
      return sendSuccessApiResponse({
        res,
        data: {
          user: sterilizeUserObj(userExist),
          token,
        },
      });
    }
  }
});
