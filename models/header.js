const {date} = require('joi');
const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
  title: String,
  details: {type: String, required: true},
  photo: String,
  created_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Header', headerSchema);
