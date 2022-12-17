const mailgun = require("mailgun-js");
const { configs } = require("../config");
const nodemailer = require("nodemailer");

exports.sendEmail = async ({ email, data, subject, template }) => {
  try {
    const transportConfig = {
      host: configs.MAIL_HOST,
      port: parseInt(configs.MAIL_PORT),
      secure: false,
      auth: {
        user: configs.MAIL_USERNAME,
        pass: configs.MAIL_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(transportConfig);

    const emailmessage = "<h1>Hello</h1>";

    const message = {
      from: `Test <${configs.MAIL_FROM_ADDRESS}>`,
      subject: "Test Email",
      to: email,
      html: emailmessage,
    };

    transporter
      .sendMail(message)
      .then((res) => console.log(JSON.stringify(res)))
      .catch((err) => {
        console.log(err);
        // throw new Error(err);
      });

    transporter.close();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
