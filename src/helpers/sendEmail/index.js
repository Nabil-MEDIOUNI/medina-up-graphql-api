const nodeMailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const { sendPassword, sendResetLink } = require('./view');

sgMail.setApiKey(process.env.SENDGRID);

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 587,
  auth: {
    user: process.env.USER,
    pass: process.env.USER_PASSWORD,
  },
});

module.exports.LNSTransporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 587,
  auth: {
    user: process.env.LNS_USER,
    pass: process.env.LNS_USER_PASSWORD,
  },
});

module.exports.sendResetLink = (email, id) => {
  // const msg = {
  //   to: email,
  //   from: 'lc.medinaup@gmail.com',
  //   subject: 'Reset password instructions',
  //   html: sendResetLink(email, id),
  // };

  // sgMail
  //   .send(msg)
  //   .then(() => {
  //     console.log('Email sent');
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  const mailOptions = {
    to: email,
    subject: 'Reset password instructions',
    html: sendResetLink(email, id),
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent!');
    }
  });
};

module.exports.sendPassword = (email, name, password) => {
  const mailOptions = {
    to: email,
    subject: 'Your current password',
    html: sendPassword(name, password),
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent!');
    }
  });
};
