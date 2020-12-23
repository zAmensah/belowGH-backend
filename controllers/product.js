const async = require('async');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const cloud = require('../helpers/cloudinary');

const Product = require('../models/products');
const Category = require('../models/category');
const Photos = require('../models/photos');

exports.addProduct = async (req, res) => {
  if (!req.files)
    return res.status(400).json({message: 'Please upload product images'});

  async.waterfall([
    function (callback) {
      Category.findOne({_id: req.body.category}, (err, category) => {
        let product = new Product(req.body);
        product.tags = req.body.tags.replace(/\s/g, '').split(',');

        category.product.push(product._id);
        category.save();
        product.save((err) => {
          if (err) return res.status(400).json({message: err});

          callback(err, product);
        });
      });
    },
    async function (product) {
      const uploader = async (path) => await cloud.uploads(path, 'Photos');

      const files = req.files;

      if (files) {
        for (const file of files) {
          const {path} = file;
          const newPath = await uploader(path);

          let photos = new Photos({
            image: newPath.url,
          });

          await photos.save();

          Product.findByIdAndUpdate(
            product._id,
            {
              $push: {
                photos: {image: newPath.url, image_id: newPath.id},
              },
            },
            {new: true}
          ).exec((err) => {
            if (err) return res.status(401).json({message: err});
            fs.unlinkSync(path);
          });
        }
      }

      const code = jwt.sign({_id: product._id}, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({message: 'Product Successfully Added', product, code});
    },
  ]);
};

exports.allProducts = (req, res, next) => {
  const perPage = 12;
  const page = req.query.page;

  async.parallel(
    [
      function (callback) {
        Product.countDocuments({}, (err, count) => {
          var totalProducts = count;
          callback(err, totalProducts);
        });
      },
      function (callback) {
        Product.find({})
          .skip(perPage * page)
          .limit(perPage)
          .populate('category')
          .deepPopulate('review.user')
          .sort('-created_at')
          .exec((err, product) => {
            if (err) return next(err);
            callback(err, product);
          });
      },
    ],
    function (err, results) {
      var totalProducts = results[0];
      var product = results[1];

      res.json({
        product: product,
        totalProducts: totalProducts,
        pages: Math.ceil(totalProducts / perPage),
      });
    }
  );
};

exports.singleProduct = (req, res) => {
  Product.findOne({slug: req.params.id})
    .populate('category')
    .exec((err, product) => {
      if (err) return res.status(500).json({message: err});

      res.json(product);
    });
};

exports.singleAdminProduct = (req, res) => {
  Product.findOne({_id: req.params.id}, (err, product) => {
    if (err || !product)
      return res.status(400).json({message: 'Product does not exist'});

    res.json(product);
  });
};

exports.limitProduct = (req, res) => {
  Product.find({})
    .limit(8)
    .populate('category')
    .deepPopulate('review.user')
    .sort('-created_at')
    .exec((err, product) => {
      if (err) return res.status(500).json({message: err});

      res.json(product);
    });
};

exports.cartProducts = (req, res) => {
  Product.find({}, (err, product) => {
    if (err) return res.status(500).json({message: err});

    res.json(product);
  });
};

exports.setCover = async (req, res) => {
  const product = await Product.findById({_id: req.params.id});

  if (product) {
    product.cover = req.body.cover;
    product.save();
    return res.json({message: 'Cover Image Set'});
  }

  res.status(401).json({message: err});
};

exports.updateProduct = (req, res) => {
  Product.findById({_id: req.params.id}, (err, product) => {
    if (err || !product)
      return res.status(400).json({message: 'Invalid params'});

    product = _.extend(product, req.body);
    product.save((err) => {
      if (err) return res.status(401).json({message: err});

      res.json({message: 'Update successful'});
    });
  });
};

exports.deletePhoto = (req, res) => {
  Product.findByIdAndUpdate(
    {_id: req.params.id},
    {$pull: {photos: {_id: req.body}}},
    {new: true}
  ).exec((err) => {
    if (err) return res.status(401).json({message: err});

    res.json({message: 'Image Successfully Removed'});
  });
};

exports.deleteProduct = (req, res) => {
  Product.findByIdAndRemove({_id: req.params.id}, (err, product) => {
    if (err || !product)
      return res.status(400).json({message: 'Imvalid parmas'});

    res.json({message: 'Product Successfully Removed'});
  });
};

exports.productViews = async (req, res, next) => {
  const view = await Product.findOneAndUpdate(
    {slug: req.params.id},
    {$inc: {views: 1}}
  );

  if (!view) return res.status(400).json({message: 'View not Added'});

  next();
};
