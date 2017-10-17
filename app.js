var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbconfig = require('./config/database');
var User = require('./models/User');
var InstanceSetting = require('./models/InstanceSetting');

//set up passport local authentication Strategy
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//Set up default mongoose connection
mongoose.connect(dbconfig.database, {
  useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var profile = require('./routes/profile');
var administration = require('./routes/administration');
var api = require('./routes/api');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//socket.io
app.use(function(req, res, next){
  res.io = io;
  
  next();
});

app.use(function(req, res, next) {
  InstanceSetting.find({}, function(err, theInstanceSettings) {
    if(err) {
      console.log(err);
    }
    console.log(theInstanceSettings);
    res.locals.instance_settings = theInstanceSettings;
    next();
  });
});




// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//need to add generation of secret when a new tenant is setup...
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin-lte', express.static('node_modules/admin-lte'))
app.use('/dist', express.static('node_modules/admin-lte/dist'))
app.use('/socket.io', express.static('node_modules/socket.io'))

app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/profile', profile);
app.use('/administration', administration);
app.use('/api', api);

//local passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// catch 404 and forward to err or handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', function (socket) {
  socket.emit('client_test', { Server_Response: 'Hello A P L E T O Client' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

module.exports = {app: app, server: server};
