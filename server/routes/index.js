var express = require('express');
var router = express.Router();
var async = require('async');

var User = require('../models/user');
var secrets = require('../config/secrets');
var sendEmail = require('../email/index').send;
var mgValidator;

if(secrets.mailgun.public){
  mgValidator = require('mailgun-validate-email')(secrets.mailgun.public);
} else {
  // stubs mailgun api email validator (you should really use this to reduce spam)
  mgValidator = function(e, cb){
    cb(null, {is_valid: true});
  };
}

// landing page
router.get('/', function(req, res, next) {
  var confirmed = false;

  if(req.query.confirmed){
    confirmed = true;
  }

  res.render('index', { title: secrets.appName || 'App Title', confirmed: confirmed });
});

// confirmation page
router.get('/signup/confirm*', function(req, res, next) {
  async.waterfall([
    function(done){
      if(req.query.u && req.query.t){
        done(null, req.query.u, req.query.t);
      } else {
        return res.redirect('/');
      }
    },
    function(userId, token, done){
      User.validateConfirmation(userId, token, function(err, user){
        if(err && err.msg === 'user_already_validated'){
          done(null, null);
        } else if(user) {
          done(null, user);
        } else {
          done({msg:'Invalid Credentials', status: 400});
        }
      });
    },
    function(user, done){
      if(user){
        var data = {};
        data.from = 'Node Prelaunch <postmaster@' + secrets.mailgun.domain + '>';
        data.template = 'verified';
        data.subject = 'Node Prelaunch: Sign Up Confirmed';
        data.email = user.email;

        sendEmail(data, done);
      } else {
        // user already validated
        done(null);
      }
    }
  ],
  function(err){
    if(err) {
      res.render('index', {
        title: 'Prelaunch App',
        error: "This confirmation token is invalid or has expired."
      });
    } else {
      res.render('index', {
        title: 'Prelaunch App',
        confirmed: true
      });
    }
  });
});

// accept post to sign up
router.post('/signup', function(req, res, next) {
  async.waterfall([
    function(done){
      // quick email validation
      req.assert('email', 'Please sign up with a valid email <3').isEmail();
      done(req.validationErrors());
    },
    function(done){
      // mailgun email validation
      mgValidator(req.body.email, function(err, results){
        if (err) {
          // api might be down, fallback to just prev email validation
          console.log(err);
          return done(null);
        }
        if(results.is_valid){
          done(null);
        } else {
          done({msg:'Please sign up with a valid email <3', status: 400});
        }
      });
    },
    function(done){
      User.createFromSignup({email: req.body.email}, done);
    },
    function(user, done){
      var data = {};
      data.from = 'Node Prelaunch <postmaster@' + secrets.mailgun.domain + '>';
      data.confirmationLink = req.headers.host +
        '/signup/confirm?u=' + user.confirmation.id +
        '&t=' + user.confirmation.token;

      if(secrets.env !== 'production'){
        data.confirmationLink = 'http://' + data.confirmationLink;
      } else {
        data.confirmationLink = 'https://' + data.confirmationLink;
      }
      console.log(data.confirmationLink);
      data.template = 'confirmation';
      data.subject = 'Node Prelaunch: Confirm Sign Up';
      data.email = user.email;

      sendEmail(data, done);
    }
  ],
  function(err, results){
    if(err && err.length){
      res.status(400).send({errors: err});
    } else if(err){
      res.status(err.status || 500).send({errors: [{msg: err.msg || "Apologies but we're unable to sign you up at this time."}]});
    } else {
      res.status(200).send([{msg: 'Woot! Thanks for signing up!!!'}]);
    }
  });
});

module.exports = router;