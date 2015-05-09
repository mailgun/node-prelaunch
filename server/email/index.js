var secrets = require('../config/secrets');
var nodemailer = require('nodemailer');
var mailgunApiTransport = require('nodemailer-mailgunapi-transport');

function sendEmail(req, user, cb){
  var confirmationLink;

  if(secrets.env !== 'production'){
    confirmationLink = 'http://' + req.headers.host + '/confirm/' + user.confirmationToken;
  } else {
    confirmationLink = 'https://' + req.headers.host + '/confirm/' + user.confirmationToken;
  }

  var transporter = nodemailer.createTransport(
    mailgunApiTransport({
      apiKey: secrets.mailgun.api,
      domain: secrets.mailgun.domain
    })
  );

  var mailOptions = {
    to: user.email,
    from: secrets.mailgun.email,
    subject: 'Confirm your sign up for node-prelaunch.herokuapp.com',
    text: 'You are receiving this email because you (or someone else) has requested to be signed up for node-prelaunch.herokuapp.com.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      confirmationLink + '\n\n' +
      "If you did not request this, feel free to ignore this email or delete it.\n"
  };

  if(secrets.env !== 'production'){
    console.log(confirmationLink);
  } else {
    transporter.sendMail(mailOptions, cb);
  }
}

module.exports = { sendEmail: sendEmail };