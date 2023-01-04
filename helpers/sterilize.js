exports.sterilizeUserData = (user) => {
  console.log(user);
  if (!user) return {};
  return {
    email: user.email,
    trials: user.trials,
    accountType: user.accountType,
    verified: user.verified,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};
