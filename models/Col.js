var mongoose = require('mongoose');

var Col = new mongoose.Schema({
  name: String,
  system_name: String,
  fields: [{ type: mongoose.Schema.ObjectId, ref: 'Field'}]
});


module.exports = mongoose.model('Col', Col);