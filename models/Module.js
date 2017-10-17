var mongoose = require('mongoose');

var Module = new mongoose.Schema({
  name: String,
  system_name: String,
  description: String,
  collections: [{ type: mongoose.Schema.ObjectId, ref: 'Col'}],
  relationships: [
    new mongoose.Schema({})
  ],
  _state: { type: mongoose.Schema.ObjectId, ref: 'ModuleState'},
  updated_at: { type: Date, default: Date.now },
  _updateby: { type: mongoose.Schema.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Module', Module);