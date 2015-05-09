var mongoose = require('mongoose');
var secrets = require('../config/secrets');
var timestamps = require('mongoose-timestamp');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },

  confirmedAt: Date,
  confirmationTokenExpires: Date,
  confirmationToken: String
});

userSchema.plugin(timestamps);

userSchema.statics.createFromSignup = function(data, cb) {
  var User = this;

  return User.findOne({ email: data.email }, function(err, existingUser) {
    if (existingUser) {
      return cb({msg: 'An account with that email address already exists.'});
    }
    // edit this portion to accept other properties when creating a user.
    var user = new User({
      email: data.email
    });

    user.setConfirmationToken(function(err){
      if (err) {
        cb({msg: "Apologies but we're unable to sign you up at this time."});
      } else {
        cb(null, user);
      }
    });
  });
};

userSchema.statics.validateConfirmationToken = function (token, cb) {
 return this.findOne({ confirmationToken: token })
    .where('confirmationTokenExpires').gt(Date.now())
    .exec(function(err, user) {
      if(err){
        return cb(err);
      }
      if (!user) {
        return cb('user_not_found');
      }

      return user.removeConfirmationToken(cb);
    });
};

userSchema.methods.setConfirmationToken = function (cb) {
  var user = this;

  crypto.randomBytes(24, function(err, buf) {
    var token = buf.toString('hex');

    user.confirmationToken = token;
    user.confirmationTokenExpires = Date.now() + 3600000 * 3; // 3 hrs

    user.save(function (err) {
      if(err){
        return cb(err);
      } else {
        return cb();
      }
    });
  });
};

userSchema.methods.removeConfirmationToken = function (cb) {
  var user = this;

  user.confirmedAt = Date.now();
  user.confirmationTokenExpires = null;
  user.confirmationToken = null;

  user.save(function (err) {
    if(err){
      return cb(err);
    } else {
      return cb(null);
    }
  });
};

module.exports = mongoose.model('User', userSchema);
