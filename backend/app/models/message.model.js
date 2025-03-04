const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    chat: {
      type: mongoose.Schema.ObjectId,
      ref: 'Chat',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '_id name avatar',
  });
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
