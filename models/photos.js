const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  image: String,
});

module.exports = mongoose.model('Photos', photoSchema);
