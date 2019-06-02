'use strict';

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role: {type:String, required: true},
  capabilities: {type: Array, require: true},
});

module.exports = mongoose.model('roleSchema', roleSchema);