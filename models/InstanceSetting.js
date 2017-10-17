var mongoose = require('mongoose');

var InstanceSetting = new mongoose.Schema({
  name: String,
  setting: String
});


module.exports = mongoose.model('InstanceSetting', InstanceSetting);