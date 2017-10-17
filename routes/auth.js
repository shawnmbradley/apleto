var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var InstanceSetting = require('../models/InstanceSetting');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});


router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.email }), req.body.password, function(err, account) {
        if (err) {
          console.log(err);
          return res.render('register', { account : account });
            
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});


router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
        req.session.instancesettings = 0
        res.redirect('/');

    
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/auth/login');
});


module.exports = router;
