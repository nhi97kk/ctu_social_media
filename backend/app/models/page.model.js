const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên của Page
    desc: { type: String, required: true }, // Mô tả Page
    avatar: {
      type: String,
      default: process.env.DEFAULT_PATH_AVATAR,
    },
    coverImage: {
      type: String,
      default: process.env.DEFAULT_PATH_COVER,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // Người sở hữu Page
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hide: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    timestamps: true,
  },
);

pageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'owner',
    select: '_id name avatar role',
  });
  next();
});

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;
