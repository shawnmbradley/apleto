var express = require('express');
var router = express.Router();
var Col = require('../models/Col');
var Module = require('../models/Module');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  res.render('index', { title: 'Express', user: req.user});

});

router.get('/collections', function(req, res, next) {
  Col.find({}).populate('fields').exec( function(err, cols) {
    console.log(cols);
    if(err) {
      console.log(err);
    } else {
      console.log(cols);
      res.json(cols);
    }
  })
});

module.exports = router;
