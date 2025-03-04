const Message = require('../models/message.model');
const Chat = require('../models/chat.model');

const catchAsync = require('../utils/catchAsync.util');
const ApiError = require('../utils/error.util');

exports.getMessage = catchAsync(async (req, res, next) => {
  let query = Message.findById(req.params.id);

  const message = await query;

  // nếu ID đúng định dạng nhưng không đúng id của bất kì tour nào
  if (!message) {
    return next(new ApiError(404, 'Message does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      message,
    },
  });
});

exports.createMessage = catchAsync(async (req, res, next) => {
  const chat = await Chat.findById(req.body.chat);

  if (!chat) {
    return next(new ApiError(404, 'Chat does not exist.'));
  }

  if (
    !chat.members.some(
      member => member._id.toString() === req.user.id.toString(),
    )
  ) {
    return next(new ApiError(404, 'You are not a member of this chat.'));
  }

  req.body.user = req.user.id;
  let message = await Message.create(req.body);

  // Populate user and convert to a plain JavaScript object with lean()
  message = await Message.findById(message._id)
    .populate('user', '_id name avatar role')
    .lean();

  // Find the receiverId by excluding the sender (req.user.id)
  const receiver = chat.members.find(
    member => member._id.toString() !== req.user.id.toString(),
  );

  message.receiverId = receiver ? receiver._id : null;

  res.status(201).json({
    status: 'success',
    data: {
      message,
    },
  });
});

exports.getAllMessagesOfChats = catchAsync(async (req, res, next) => {
  const messages = await Message.find({ chat: req.params.chatId });
  console.log(req.params.chatId);

  res.status(200).json({
    status: 'success',
    data: { messages },
  });
});
