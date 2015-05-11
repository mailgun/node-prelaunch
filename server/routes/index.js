var express = require('express');
var router = express.Router();

var User = require('../models/user');
var secrets = require('../config/secrets');
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
router.get('/signup/confirm', function(req, res, next) {
  if(req.query.u && req.query.t){
    User.validateConfirmation(req.query.u, req.query.t, function(err){
      if (err) {
        res.render('index', {
          title: 'Prelaunch App',
          error: 'This confirmation token is invalid or has expired.'
        });
      } else {
        res.render('index', {
          title: 'Prelaunch App',
          confirmed: true
        });
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
    return res.status(400).send(errors);
  }

  User.createFromSignup({email: req.body.email}, function(err, user){
    if (err) {
      return res.status(err.status || 500).send([{msg: err.msg || "Apologies but we're unable to sign you up at this time."}]);
    }
    sendEmail(req, user, function(err){
      if (err) {
        return res.status(500).send([{msg: err.msg || "Apologies but we're unable to sign you up at this time."}]);
      }
      return res.status(200).send([{msg: 'Woot! Thanks for signing up!!!'}]);
    });
  });
});

module.exports = router;