const nodeMailer = require('nodemailer');

exports.sendEmail = (emailData) => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.APP_MAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  return transporter
    .sendMail(emailData)
    .then((info) => {
      console.log(`Message sent: ${info.response}`);
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    });
};
