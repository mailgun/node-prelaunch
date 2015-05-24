var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');
var async = require('async');
var secrets = require('../config/secrets');

var templatesDir = path.resolve(__dirname, '../email');

var mailgunApiTransport = require('nodemailer-mailgunapi-transport');
var transport = nodemailer.createTransport(
  mailgunApiTransport({
    apiKey: secrets.mailgun.api,
    domain: secrets.mailgun.domain
  })
);

// An example users object with formatted email function

function send(locals, cb){
  var template = new EmailTemplate(path.join(templatesDir, locals.template));

  template.render(locals, function (err, results) {
    if (err) {
      return cb(err);
    }

    transport.sendMail({
      from: 'Node Prelaunch <postmaster@' + secrets.mailgun.domain + '>',
      to: locals.email,
      subject: locals.subject,
      html: results.html,
      text: results.text
    }, function (err, responseStatus) {
      if (err) {
        return cb(err);
      }
      cb(null);
    });
  });
}


module.exports = { send: send };