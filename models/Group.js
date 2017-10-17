var mongoose = require('mongoose');

var Group = new mongoose.Schema({
  name: String,
  email: String,
  _manager: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  permissions: [
    new mongoose.Schema({
      _mod: {type: mongoose.Schema.Types.ObjectId, ref: 'Mod'},
      permission: String
    })
  ],
  description: String,
  department: String,
  state: String,
  updated_at: { type: Date, default: Date.now },
});


User.plugin(passportLocalMongoose)


module.exports = mongoose.model('User', User);