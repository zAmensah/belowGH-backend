const Review = require('../models/reviews');
const Product = require('../models/products');

exports.addReview = (req, res) => {
  const review = new Review(req.body);
  review.user = req.decoded._id;

  review.save((err) => {
    if (err) return res.status(401).json({message: err});

    Product.findByIdAndUpdate(
      {slug: req.params.id},
      {$push: {review: review._id}},
      {new: true}
    ).exec((err) => {
      if (err) return res.status(401).json({message: err});

      res.json({message: 'Review Added Successfully'});
    });
  });
};
