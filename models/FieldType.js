var mongoose = require('mongoose');

var FieldType = new mongoose.Schema({
  name: String,
  system_name: String
});


module.exports = mongoose.model('FieldType', FieldType);