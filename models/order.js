const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'},
  status: {type: String, default: 'pending', enum: ['pending', 'done']},
  totalPrice: {type: Number},
  products: [
    {
      product: {type: ObjectId, ref: 'Product'},
      quantity: {type: Number, default: 1},
    },
  ],
  created_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Order', orderSchema);
