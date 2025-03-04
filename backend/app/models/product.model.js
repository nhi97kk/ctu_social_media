const mongoose = require('mongoose');
const slugify = require('slugify');

const { productMessage } = require('../languages');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, productMessage.requiredName],
      trim: true,
      minlength: [5, productMessage.minlengthName],
      maxlength: [200, productMessage.maxlengthName],
    },
    price: {
      type: Number,
      required: [true, productMessage.requiredPrice],
      min: [0, productMessage.minPrice],
    },
    stockQuantity: {
      type: Number,
      required: [true, productMessage.requiredStockQuantity],
      min: [0, productMessage.minStockQuantity],
    },
    images: [{ type: String }],
    note: {
      type: String,
    },
    type: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sold'],
      default: 'pending', // pending: đang chờ duyệt, approved: đã duyệt, sold: đã bán
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      required: [true, productMessage.requiredCreatedBy],
      ref: 'User',
    },
    hide: { type: Boolean, default: false },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    id: false,
    timestamps: true,
  },
);

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: '_id name avatar role',
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

