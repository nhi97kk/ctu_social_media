const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Notification = require('../models/notification.model');

async function createNotification(
  userId,
  actorId,
  actionType,
  targetId,
  targetModel,
) {
  const message = generateMessage(actorId, actionType, targetModel); // Hàm tùy chọn để tự động tạo nội dung

  const notification = new Notification({
    user: userId,
    actor: actorId,
    actionType,
    targetId,
    targetModel,
    message,
  });

  await notification.save();
}

// Hàm tùy chỉnh để tạo nội dung thông báo
function generateMessage(actor, actionType, targetModel) {
  switch (actionType) {
    case 'like':
      return `Người dùng ${actor} đã like ${targetModel.toLowerCase()} của bạn.`;
    case 'comment':
      return `Người dùng ${actor} đã bình luận trên ${targetModel.toLowerCase()} của bạn.`;
    case 'reply':
      return `Người dùng ${actor} đã trả lời ${targetModel.toLowerCase()} của bạn.`;
    case 'solution':
      return `Người dùng ${actor} đã đánh dấu một câu trả lời của bạn là giải pháp.`;
    default:
      return 'Bạn có thông báo mới.';
  }
}
