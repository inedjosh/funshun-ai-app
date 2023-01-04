const { sendEmail } = require("../services/sendMail");

exports.testEmail = async (req, res, next) => {
  try {
    await sendEmail({ email: "test@gmail.com" });

    return res.json(true);
  } catch (error) {
    console.log(error);
  }
};
