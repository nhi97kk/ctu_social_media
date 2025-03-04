const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync.util');
const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');

exports.searchChat = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  // Tìm kiếm nhóm (group): `name` không rỗng
  const groupFilter = {};
  if (name) {
    groupFilter.name = { $regex: name, $options: 'i' };
  }

  // Tìm kiếm nhóm chat
  const groupChats = await Chat.find(groupFilter);

  let privateChats = [];
  if (name) {
    // Tìm kiếm người dùng dựa trên `name`
    const users = await User.find({
      name: { $regex: name, $options: 'i' },
      _id: { $ne: req.user.id }, // Loại trừ chính người tìm kiếm
    }).select('_id');

    if (users.length > 0) {
      const orFilters = users.map(user => ({
        members: { $all: [req.user.id, user._id] },
      }));
      privateChats = await Chat.find({ name: '', $or: orFilters });
    }
  }

  // Kết hợp kết quả
  const chats = [...groupChats, ...privateChats];

  res.status(200).json({
    status: 'success',
    data: { chats },
  });
});

exports.getChat = catchAsync(async (req, res, next) => {
  let query = Chat.findById(req.params.id).populate({
    path: 'createdBy',
    select: '_id name avatar role',
  });

  const chat = await query;

  // nếu ID đúng định dạng nhưng không đúng id của bất kì tour nào
  if (!chat) {
    return next(new ApiError('Chat does not exist.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      chat,
    },
  });
});
// exports.getAllChats = factory.getAll(Chat);
exports.createChat = catchAsync(async (req, res, next) => {
  const { members } = req.body;

  // Kiểm tra xem có cuộc trò chuyện nào chứa các thành viên được cung cấp không
  const existingChat = await Chat.findOne({
    members: { $all: members },
    createdBy: null,
  });

  if (existingChat) {
    res.status(201).json({
      status: 'success',
      data: {
        existingChat,
      },
    });
  } else {
    const chat = await Chat.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        chat,
      },
    });
  }
});

exports.createGroupChat = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const payload = { ...req.body, createdBy: userId };

  const chat = await Chat.create(payload);

  res.status(201).json({
    status: 'success',
    data: { chat },
  });
});

exports.updateGroupChat = catchAsync(async (req, res, next) => {
  const chat = await Chat.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!chat) {
    return next(new ApiError(404, 'Chat does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: { chat },
  });
});
// exports.updateChat = factory.updateOne(Chat);
// exports.deleteChat = factory.deleteOne(Chat);

exports.getAllChatsUser = catchAsync(async (req, res, next) => {
  const chats = await Chat.find({ members: { $in: [req.params.userId] } }).sort(
    { createdAt: -1 },
  );

  res.status(200).json({
    status: 'success',
    data: { chats },
  });
});
