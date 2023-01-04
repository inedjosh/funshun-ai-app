const User = require("./../../model/user");
const { validationResult } = require("express-validator");
const getErrorMessagesFromArray = require("../../helpers/getErrorMessagesFromArray");
const {
  sendUserExistError,
} = require("../../helpers/errors/commonAppAuthErrors");
const {
  createOneFactory,
  findOneFactory,
} = require("../../utils/db/factories");
const { sendBadRequestError } = require("../../helpers/errors/commonAppErrors");
const findUserByEmail = require("../../utils/Auth/findUserByEmail");
const { hashString } = require("../../utils/Auth/hash");
const asyncHandler = require("../../utils/asyncHandler");
const { sterilizeUserData } = require("../../helpers/sterilize");
const { createToken } = require("../../utils/Auth/generatejwtToken");
const sendSuccessApiResponse = require("../../utils/responses/sendSuccessApiResponse");

module.exports = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = getErrorMessagesFromArray(errors.array());

    //   send badRequestError if error exists in req.Body
    next(sendBadRequestError(errorMessages));
  }

  const { email, firstName, lastName, password } = req.body;

  // check for user in Db
  const userExist = await findUserByEmail(email);
  console.log("found user", userExist);
  // if user not found return userexisterror
  if (userExist) next(sendUserExistError());

  // hash password
  const hashedPassword = await hashString(password);
  console.log("pawdhash", hashedPassword);
  // create a new user on DB
  const createdUser = await createOneFactory(User, {
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (createdUser) {
    console.log("user", createdUser);
    //** When user is created
    //** Create user token

    const token = await createToken({
      id: createdUser._id,
      email: createdUser.email,
    });

    // check if token is created  and send response
    if (token) {
      return sendSuccessApiResponse({
        res,
        statusCode: 201,
        message: "User created successfully",
        data: {
          user: sterilizeUserData(createdUser),
          token,
        },
      });
    }
  }
});
