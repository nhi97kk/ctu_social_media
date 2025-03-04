const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên của Group
    desc: { type: String, required: true }, // Mô tả Group
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
    }, // Người sở hữu Group
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    requests: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hide: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  },
);

groupSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'owner',
    select: '_id name avatar role',
  });
  next();
});

module.exports = mongoose.model('Group', groupSchema);
