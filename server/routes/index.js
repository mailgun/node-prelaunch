var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var User = require('../models/user');
var secrets = require('../config/secrets');
var async = require('async');
var sendEmail = require('../email/index').sendEmail;

// landing page
router.get('/', function(req, res, next) {
  var confirmed = false;

  if(req.query.confirmed){
    confirmed = true;
  }

  res.render('index', { title: 'Prelaunch App', confirmed: confirmed });
});

// confirmation page
router.get('/confirm/:token*?', function(req, res, next) {
  if(req.params.token){
    User.validateConfirmationToken(req.params.token, function(err){
      if (err) {
        res.render('index', {
          title: 'Prelaunch App',
          error: 'This confirmation token is invalid or has expired.'
        });
      } else {
        res.redirect('/?confirmed=true');
      }
    });
  } else {
    res.redirect('/');
  }
});

// accept post to sign up
router.post('/signup', function(req, res, next) {
  req.assert('email', 'Please sign up with a valid email <3').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    res.status(400).send(errors);
  } else {
    User.createFromSignup({email: req.body.email}, function(err, user){
      if (err) {
        return res.status(500).send([{msg: err.msg || "Apologies but we're unable to sign you up at this time."}]);
      }
      sendEmail(req, user, function(err){
        if (err) {
          return res.status(500).send([{msg: err.msg || "Apologies but we're unable to sign you up at this time."}]);
        }
        return res.status(200).send([{msg: 'Woot! Thanks for signing up!!!'}]);
      });
    });
  }
});

module.exports = router;