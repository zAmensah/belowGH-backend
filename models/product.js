const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const slug = require('slug');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const productSchema = new mongoose.Schema(
  {
    category: {type: ObjectId, ref: 'Category'},
    reviews: [{type: ObjectId, ref: 'Review'}],
    title: {type: String, required: true},
    slug: String,
    description: {type: String, required: true},
    price: {type: Number, required: true},
    oldprice: Number,
    discount: Number,
    photos: [{image: String, image_id: String}],
    cover: String,
    views: Number,
    feature: {type: Boolean, default: false},
    tags: [String],
    updated_on: Date,
    created_at: {type: Date, default: Date.now},
  },
  {
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
  }
);

productSchema.pre('save', function (next) {
  this.slug = slug(this.title, {lower: true});
  next();
});

productSchema.virtual('averageRating').get(function () {
  var rating = 0;
  if (this.reviews.length == 0) {
    rating = 0;
  } else {
    this.reviews.map((review) => {
      rating += review.rating;
    });
    rating = rating / this.reviews.length;
  }
  return rating;
});

productSchema.plugin(deepPopulate);
module.exports = mongoose.model('Product', productSchema);
