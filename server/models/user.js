var mongoose = require('mongoose');
var secrets = require('../config/secrets');
var timestamps = require('mongoose-timestamp');
var confirmable = require('./helpers/confirmable');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true }
});

userSchema.plugin(timestamps);

// confirmation never expires (in minutes)
userSchema.plugin(confirmable, {expires: 0, maxAttempts: 5});

userSchema.statics.createFromSignup = function(data, cb) {
  var User = this;

  return User.findOne({ email: data.email }, function(err, existingUser) {
    if (existingUser && existingUser.confirmation.validatedAt) {
      return cb({msg: "You're already signed up", status: 400});
    }
    if(existingUser && existingUser.confirmation.count >= 3) {
      if(existingUser.confirmation.initiatedAt > Date.now() - (60000 * 30)){
        return cb({msg: "Slow down there. Check your inbox for the previously sent emails.", status: 400});
      }
    }
    // edit this portion to accept other properties when creating a user.
    var user = existingUser || new User({
      email: data.email
    });

    user.setConfirmation(function(err){
      if (err) {
        cb({msg: "Apologies but we're unable to sign you up at this time.", status: 500});
      } else {
        cb(null, user);
      }
    });
  });
};

userSchema.statics.findConfirmed = function(values, cb) {
  var User = this;

  return User.find({'confirmation.validatedAt': {$gt: new Date(0)}}, values, function(err, users){
    if (err) {
      cb({msg: "Error finding users", status: 500});
    } else {
      cb(null, users);
    }
  });
};

module.exports = mongoose.model('User', userSchema);
