const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Question title is required.'] },
    body: {
      type: String,
      required: [true, 'Question body is required.'],
    },
    images: [{ type: String }],
    topic: {
      type: mongoose.Schema.ObjectId,
      ref: 'Topic',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [{ type: mongoose.Schema.ObjectId, ref: 'Answer' }],
    isSolved: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    hide: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    timestamps: true,
  },
);

questionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: '_id name avatar role',
  }).populate({
    path: 'topic',
    select: 'name',
  });
  next();
});

module.exports = mongoose.model('Question', questionSchema);
