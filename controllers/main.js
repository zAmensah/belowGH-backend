const _ = require('lodash');
const fs = require('fs-extra');

const cloud = require('../helpers/cloud');

const Category = require('../models/category');
const Product = require('../models/products');
const User = require('../models/user');
const Header = require('../models/header');

/*===================
 CATEGORY SECTION
===================*/
exports.addCategory = async (req, res) => {
  const exists = await Category.findOne({name: req.body.name});

  if (exists) {
    return res.status(401).json({message: 'Category already exists'});
  }

  let category = new Category(req.body);
  await category.save();
  res.json({message: 'Category Added Successfully'});
};

exports.allCategory = (req, res) => {
  Category.find({}, (err, category) => {
    res.json(category);
  });
};

exports.singleCategory = (req, res) => {
  Category.findOne({slug: req.params.id})
    .populate('product')
    .exec((err, category) => {
      if (err) res.status(400).json({message: err});

      res.json(category);
    });
};

exports.updateCategory = (req, res) => {
  Category.findOne({_id: req.params.id}, (err, category) => {
    if (err || !category)
      return res.status(401).json({message: 'Error occured'});

    category = _.extend(category, req.body);
    category.save();
    res.json({message: 'Update successful'});
  });
};

/*===================
 FEATURE SECTION
===================*/
exports.feature = (req, res) => {
  Product.findOne({_id: req.params.id}, (err, product) => {
    if (err) return res.status(400).json({message: err});

    if (product.feature == false) {
      return product.updateOne({feature: true}, (err) => {
        if (err) return res.status(401).json({message: err});
        res.json({message: 'Product Added to Feature'});
      });
    } else {
      return product.updateOne({feature: false}, (err) => {
        if (err) return res.status(401).json({message: err});
        res.json({message: 'Product Removed from Feature'});
      });
    }
  });
};

exports.getFeature = (req, res) => {
  Product.find({feature: true})
    .populate('category')
    .limit(6)
    .sort('-created_at')
    .exec((err, product) => {
      if (err) return res.status(500).json({message: err});

      res.json(product);
    });
};

/*===================
 FAVORITE SECTION
===================*/
exports.addFavorite = (req, res) => {
  User.findByIdAndUpdate(
    {_id: req.decoded._id},
    {$push: {favorites: req.body.favorites}},
    {new: true}
  ).exec(() => {
    return res.json({message: 'Product Successfully Added to Favorite'});
  });
};

exports.removeFavorite = (req, res, next) => {
  User.findOne({favorites: req.body.favorites}, (err, favorite) => {
    if (err || !favorite) return next();

    User.findByIdAndUpdate(
      {_id: req.decoded._id},
      {$pull: {favorites: req.body.favorites}},
      {new: true}
    ).exec((err, done) => {
      if (err) return res.status(401).json({message: err});

      return res.json({
        message: 'Product Successfully Removed from Favorite',
      });
    });
  });
};

exports.getFavorite = (req, res) => {
  User.findOne({_id: req.decoded._id})
    .populate('favorite')
    .exec((err, favorite) => {
      if (err || !favorite) return res.status(400).json({message: err});

      res.json(favorite);
    });
};

exports.checkFavorite = (req, res) => {
  User.findOne({_id: req.decoded.user._id})
    .populate('favorites')
    .exec((err, done) => {
      var productFavorite = done.favorites.some(function (favorite) {
        return favorites.equals(req.params.id);
      });
      res.json({productFavorite});
    });
};

/*===================
 HEADER SECTION
===================*/
exports.addHeader = async (req, res, next) => {
  const result = await cloud.uploads(req.file.path, {
    public_id: `logo/req.file.filename`,
  });

  let header = new Header(req.body);
  header.photo = result.url;

  fs.unlink(result);

  header.save((err) => {
    if (err) return next(err);
    res.json({message: 'Header set successfully'});
  });
};

exports.getHeaders = (req, res) => {
  Header.find({}, (err, header) => {
    res.json(header);
  });
};

exports.editHeaders = (req, res) => {
  Header.findById({_id: req.params.id}, (err, header) => {
    if (err) return res.status(400).json({message: err});

    header = _.extend(header, req.body);
    header.save();
    res.json({message: 'Edit Successful'});
  });
};

exports.deleteHeader = (req, res) => {
  Header.findByIdAndRemove({_id: req.params.id}, (err, header) => {
    res.json({message: 'Header removed successfully'});
  });
};
