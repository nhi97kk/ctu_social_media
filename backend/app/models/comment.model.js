const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: [true, 'Content of comment is required!'],
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
    hide: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '_id name avatar',
  }).populate({
    path: 'post',
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
