// models/product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  key: {
    type: Number,
    required: true,
  },
  photos: [{
    url: {
      type: String,
      required: true,
    },
  }],
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide product name'],
    maxlength: [100, 'Product name cannot be more than 100 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    elevation: {
      values: [
        'earphones',
        'mobile',
        'watch'
      ],
      message: 'Please select correct category for product'
    },
  },
  colors: [{
    upperhex: {
      type: String,
      required: true,
    },
    lowerhex: {
      type: String,
      required: true,
    }
  }],
  rating: {
    type: Number,
    required: true,
  },
  reviews: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
