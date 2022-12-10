const nodemailer = require("nodemailer");
const path = require("path");
const { configs } = require("../config");
const sendGridTransport = require("nodemailer-sendgrid-transport");

module.exports = async (reciepient, mailData, subject, mailTemplate) => {
  // if (appInProductionEnvironment()) {
  //   transportConfig.secure = true;
  // }
  console.log(reciepient);

  const transporter = nodemailer.createTransport(
    sendGridTransport({
      auth: {
        api_key: configs.SENDGRID_KEY,
      },
    })
  );

  // const mailHtml = await ejs.renderFile(
  //   path.resolve(`src/views/emails/${mailTemplate}.ejs`),
  //   { data: { ...mailData } }
  // );

  const message = {
    from: `joshua@lynkk.io`,
    subject: "Welcome",
    to: reciepient.email,
    html: "<p> Welcome</p>",
  };

  try {
    const response = await transporter.sendMail(message);

    if (response) console.log(response);
  } catch (err) {
    console.error(err);
  }

  transporter.close();
  return true;
};
