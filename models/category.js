const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const slug = require('slug');

const categorySchema = new mongoose.Schema({
  name: {type: String, unique: true, lowercase: true},
  slug: String,
  product: [{type: ObjectId, ref: 'Product'}],
  created_at: {type: Date, default: Date.now},
});

categorySchema.pre('save', function (next) {
  this.slug = slug(this.name, {lower: true});
  next();
});

module.exports = mongoose.model('Category', categorySchema);
