const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    content: { type: String, required: [true, 'Answer content is required.'] },
    images: [{ type: String }],
    question: {
      type: mongoose.Schema.ObjectId,
      ref: 'Question',
      required: [true, 'Question id is required.'],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User id is required.'],
    },
    parentAnswer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Answer',
      default: null,
    }, // Thêm để cho phép reply một answer
    isSolution: { type: Boolean, default: false },
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

answerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: '_id name avatar role',
  });
  next();
});

module.exports = mongoose.model('Answer', answerSchema);
