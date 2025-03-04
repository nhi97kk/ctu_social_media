const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    // Người thực hiện report
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Dùng để chỉ đến question, answer, hoặc post liên quan
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetModel',
    },
    // Xác định loại đối tượng của thông báo (post, question, answer)
    targetModel: {
      type: String,
      enum: ['Post', 'Comment', 'Question', 'Answer', 'User', 'Page', 'Group'],
      required: true,
    },
    // Nội dung mô tả hành động
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'rejected'],
      default: 'pending',
    },
    hide: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('Report', reportSchema);
