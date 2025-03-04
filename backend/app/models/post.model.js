const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    desc: {
      type: String,
      required: [true, 'Content of post is required!'],
    },
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    shares: { type: Number, default: 0 },
    posted_on: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
      required: true,
    }, // Có thể là User, Page, Group, hoặc Market
    onModel: {
      type: String,
      required: true,
      enum: ['User', 'Page', 'Group'], // Bài viết có thể được đăng trên các loại này
    },
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    }, // Người đăng bài
    shared_from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    }, // Bài viết gốc được chia sẻ
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

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '_id name avatar',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
