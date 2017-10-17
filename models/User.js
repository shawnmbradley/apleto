var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  username: String,
  password: String,
  jobtitle: String,
  department: String,
  state: String,
  groups: {
    _group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  },
  updated_at: { type: Date, default: Date.now },
});


User.plugin(passportLocalMongoose)


module.exports = mongoose.model('User', User);