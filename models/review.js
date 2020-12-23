const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'},
  product: {type: ObjectId, ref: 'Product'},
  description: {type: String, required: true},
  rating: {type: Number, default: 0},
  created_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Review', reviewSchema);
