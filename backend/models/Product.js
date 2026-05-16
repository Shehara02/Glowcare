/* ========================================
   PRODUCT MODEL
   ======================================== */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description']
    },
    category: {
      type: String,
      enum: ['cleanser', 'serum', 'moisturizer', 'mask', 'sunscreen', 'other'],
      required: [true, 'Please select a category']
    },
    skinType: {
      type: [String],
      enum: ['oily', 'dry', 'sensitive', 'all'],
      required: [true, 'Please select skin types']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0
    },
    image: {
      type: String,
      default: null
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    reviews: [reviewSchema],
    ingredients: [String],
    benefits: [String],
    usage: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Calculate average rating
productSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = Math.round((sum / this.reviews.length) * 10) / 10;
    this.numReviews = this.reviews.length;
  } else {
    this.rating = 0;
    this.numReviews = 0;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
