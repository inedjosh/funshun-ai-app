const mailgun = require("mailgun-js");
const { configs } = require("../config");

const mg = mailgun({
  apiKey: configs.MAILGUN_KEY,
  domain: configs.MAILGUN_DOMAIN,
});

const data = {
  from: "Inedu joshua <me@samples.mailgun.org>",
  to: `inedujoshua@gmail.com, josh@${configs.MAILGUN_DOMAIN}`,
  subject: "Hello",
  text: "Testing some Mailgun awesomness!",
};
mg.messages().send(data, function (error, body) {
  console.log(body);
});
