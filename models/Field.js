var mongoose = require('mongoose');

var Field = new mongoose.Schema({
  name: String,
  system_name: String,
  _type: { type: mongoose.Schema.ObjectId, ref: 'FieldType'},
  _module: { type: mongoose.Schema.ObjectId, ref: 'Module'},
  _collection: { type: mongoose.Schema.ObjectId, ref: 'Col'},
  lookup: {
    _collection: { type: mongoose.Schema.ObjectId, ref: 'Col'},
    _field: { type: mongoose.Schema.ObjectId, ref: 'Field'}
  }
});


module.exports = mongoose.model('Field', Field);