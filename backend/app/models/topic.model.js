const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Topic name is required.'] },
    desc: { type: String, required: [true, 'Topic description is required.'] },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Topic owner is required.'],
      ref: 'User',
    },
    questions: [{ type: mongoose.Schema.ObjectId, ref: 'Question' }],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    id: false,
    timestamps: true,
  },
);

topicSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: '_id name avatar role',
  });
  next();
});

module.exports = mongoose.model('Topic', topicSchema);
