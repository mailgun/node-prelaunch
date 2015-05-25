var secrets = require('../config/secrets');
var email = require('./index');
var User = require('../models/user');
var mongoose = require('mongoose');

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

mongoose.connection.once('open', sendEmailUpdates);

function sendEmailUpdates(){
  var locals = {
    from: 'Node Prelaunch <postmaster@' + secrets.mailgun.domain + '>',
    subject: 'Node Prelaunch: New Features',
    template: 'campaign'
  };

  User.findConfirmed('email',function(err, users){
    if(err || !users.length){
      console.log('no users found');
      mongoose.disconnect();
    } else {
      email.batch(locals, users, function(err){
        console.log(users.length + ' emails sent!!!');
        mongoose.disconnect();
      });
    }
  });
}