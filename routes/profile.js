var express = require('express');
var router = express.Router();
var async = require('async');
var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }

  res.render('user/profile', { user: req.user });

});

/* GET users listing. */
router.post('/', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  console.log(req.user);
  console.log('---------------------');
  console.log(req.body);
  User.findByIdAndUpdate(req.user._id, req.body, function(err) {
    if(err) {
      console.log(err);
      var message = err;
      res.render('user/profile', { user: req.user, message: message });
    } else {
      console.log('update');
      var message = "Good news!  Your profile changes have been saved."
      res.render('user/profile', { user: req.user, message: message });
    }
  });

});

module.exports = router;