const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

chatSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'members',
    select: '_id name avatar role',
  }).populate({
    path: 'createdBy',
    select: '_id name avatar role',
  });
  next();
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
