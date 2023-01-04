const mailgun = require("mailgun-js");
const { configs } = require("../config");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

module.exports = async ({ email, data, subject, template }) => {
  const DOMAIN = configs.MAILGUN_DOMAIN;
  const mg = mailgun({ apiKey: configs.MAILGUN_KEY, domain: DOMAIN });

  const mailHtml = await ejs.renderFile(
    path.resolve(`views/emails/${template}.ejs`),
    {
      data: {
        ...data,
      },
    }
  );

  const message = {
    from: `Fashun AI <${configs.MAIL_FROM_ADDRESS}>`,
    subject: subject,
    to: email,
    html: mailHtml,
  };

  mg.messages().send(message, function (error, body) {
    if (error) console.log(error);
    console.log(body);
  });
};

// module.exports = async ({ email, data, subject, template }) => {
//   // try {
//   //   console.log(email, data, subject);
//   //   const transportConfig = {
//   //     host: configs.MAIL_HOST,
//   //     port: parseInt(configs.MAIL_PORT),
//   //     secure: false,
//   //     auth: {
//   //       user: configs.MAIL_USERNAME,
//   //       pass: configs.MAIL_PASSWORD,
//   //     },
//   //   };

//   //   const transporter = nodemailer.createTransport(transportConfig);

//   //   const emailmessage = `<div>
//   //       <div style="border-bottom:1px solid #ccc; padding: 2px 0;">
//   //         <h1>Hello, </h1>
//   //       </div>
//   //       <p> Click the button button below to verify your email address</p>

//   //      <button style="width:100%; height:40px; background:#202020;">
//   //        <a href="${configs.CLIENT_URL}?verifcationCode=${data}&email=${email}" style="color: white; text-decoration: none;">Click here</a>
//   //      </button>

//   //     </div>`;

//   //   const message = {
//   //     from: `Test <${configs.MAIL_FROM_ADDRESS}>`,
//   //     subject: subject,
//   //     to: email,
//   //     html: emailmessage,
//   //   };

//   //   transporter
//   //     .sendMail(message)
//   //     .then((res) => console.log(JSON.stringify(res)))
//   //     .catch((err) => {
//   //       console.log(err);
//   //       // throw new Error(err);
//   //     });

//   //   transporter.close();
//   //   return true;
//   // } catch (error) {
//   //   console.log(error);
//   //   return false;
//   // }
//   try {

//   } catch (error) {

//   }
// };
