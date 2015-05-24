var fs = require('fs');
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

var templates = {};

// load templates once
fs.readdirSync(templatesDir).forEach(function(file) {
  if(fs.statSync(path.join(templatesDir, file)).isDirectory()){
    templates[file] = new EmailTemplate(path.join(templatesDir, file));
  }
});

function send(locals, cb){
  var template = templates[locals.template];

  if(!template){
    return cb({msg: 'Template not found', status: 500});
  }

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