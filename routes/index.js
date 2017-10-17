var express = require('express');
var router = express.Router();
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  res.render('index', { title: 'Express', user: req.user});

});

module.exports = router;
