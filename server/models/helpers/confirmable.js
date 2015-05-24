var shortid = require('shortid');
var crypto = require('crypto');
var _ = require('lodash');

var confirmable = function(schema, options){
  var config = _.merge({}, options);
  var defaults = {
     expires: 0
  };

  config = _.defaults(config, defaults);

  schema.add({
    confirmation: {
      count: { type: Number, default: 0 },
      id: { type: String, unique: true },
      validatedAt: Date,
      initiatedAt: Date,
      token: String
    }
  });

  schema.methods.setConfirmation = function (cb) {
    var doc = this;

    setConfirmation(doc, 'confirmation', cb);
  };

  schema.statics.validateConfirmation = function (id, token, cb) {
    var User = this;
    var data = {
      'confirmation.id': id,
      'confirmation.token': token
    };

    return User.findUserByConfirmation(data, function(err, user){
      if(err){
        return cb(err);
      }
      if(!user){
        cb({msg: 'user_not_found', status: 404});
      }
      if(user.confirmation.validatedAt){
        return cb({msg: 'user_already_validated', status: 400});
      }

      user.confirmation.validatedAt = Date.now();
      user.save(function (err) {
        if(err){
          return cb({msg: "user_error_updating", status: 500});
        } else {
          return cb(null, user);
        }
      });
    });
  };

  schema.statics.findUserByConfirmation = function(data, cb) {
    var User = this,
    query = User.findOne(data);

    if(config.expires > 0){
      query.where('initiatedAt').gt(Date.now() - (config.expires * 1000 * 60));
    }

    return query.exec(function(err, user) {
      if(err){
        return cb(err);
      }
      if (!user) {
        return cb({msg: 'user_not_found', status: 404});
      }

      return cb(null, user);
    });
  };
};

function setConfirmation(doc, prop, cb) {
  crypto.randomBytes(24, function(err, buf) {
    if(err){
      return cb(err);
    }

    var token = buf.toString('hex');

    doc[prop].id = shortid.generate();
    doc[prop].token = token;
    doc[prop].initiatedAt = Date.now();
    doc[prop].validatedAt = undefined;
    doc[prop].count = doc[prop].count ? ++doc[prop].count : 1;

    doc.save(function (err) {
      if(err){
        return cb(err);
      } else {
        return cb();
      }
    });
  });
}

exports = module.exports = confirmable;