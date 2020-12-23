const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const bcrypt = require('bcryptjs');
const {string, boolean} = require('joi');

const saltRound = 10;

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  phone: {type: String, required: true},
  isAdmin: {type: Boolean, default: false},
  reset_password: {type: String, default: ''},
  favorites: [{type: ObjectId, ref: 'Product'}],
  orders: {type: Number, default: 0},
  account_updated: Date,
  created_at: {type: Date, default: Date.now},
});

userSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, saltRound, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
