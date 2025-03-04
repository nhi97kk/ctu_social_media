const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Người thực hiện hành động (like, bình luận, trả lời, v.v.)
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Hành động thực hiện (like, comment, answer, etc.)
    actionType: {
      type: String,
      enum: ['like', 'comment', 'reply', 'solution'],
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
      enum: ['Post', 'Question', 'Answer'],
      required: true,
    },
    // Nội dung mô tả hành động
    message: {
      type: String,
      required: true,
    },
    // Đánh dấu thông báo đã đọc chưa
    isRead: {
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

module.exports = mongoose.model('Notification', notificationSchema);
