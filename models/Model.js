var mongoose = require('mongoose');

var Schema=mongoose.Schema;
var Model=new Schema(Schema.Types.Mixed, {strict: false});

module.exports = mongoose.model('Model', Model);