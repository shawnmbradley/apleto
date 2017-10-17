var mongoose = require('mongoose');

var ModuleState = new mongoose.Schema({
  state: String,
});


module.exports = mongoose.model('ModuleState', ModuleState);