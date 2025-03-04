const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const { filterPayload } = require('../utils/extract.util');
const catchAsync = require('../utils/catchAsync.util');
const { userMessage } = require('../languages');

const Image = require('../models/image.model');
const User = require('../models/user.model');

// For admin
exports.getAllUser = catchAsync(async (req, res, next) => {
  let mongooseQuery = new MongooseQuery(User.find(), {
    ...req.query,
    isAdminAccess: true,
  });
  mongooseQuery.filter().sort().paginate();

  const users = await mongooseQuery.query.select('-password +active');

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

// For user
exports.searchUser = catchAsync(async (req, res, next) => {
  const { email, name } = req.query;

  // Xây dựng bộ lọc
  const filter = { active: true, _id: { $ne: req.user.id } };
  if (email) filter.email = email;
  // Tìm kiếm theo name (xử lý regex tại đây)
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  // Áp dụng bộ lọc trong find()
  const mongooseQuery = new MongooseQuery(User.find(filter), {
    isAdminAccess: true,
  });

  const users = await mongooseQuery
    .filter()
    .sort()
    .paginate()
    .query.select('-password');

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.userId,
    isAdminAccess: true,
  }).select('+active');

  if (!user) {
    return next(new ApiError(404, userMessage.userNotFound));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const payload = { ...req.body };

  const user = await User.create(payload);

  res.status(201).json({
    status: 'success',
    data: { user },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.userId, isAdminAccess: true },
    { ...req.body },
    { new: true, runValidators: true },
  ).select('+active');

  if (!user) {
    return next(new ApiError(404, userMessage.userNotFound));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  // Remove user
  const user = await User.findOneAndUpdate(
    { _id: req.params.userId },
    { active: false },
    { new: true, runValidators: true },
  ).select('+active');

  if (!user) {
    return next(new ApiError(404, userMessage.userNotFound));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// For user
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    '-active -__v -password -passwordChangedAt',
  );

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.user.id } }).select(
    '-active -__v -password -passwordChangedAt',
  );

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Kiểm tra xem email có tồn tại trong req.body và có khác với email hiện tại của người dùng không
  if (req.body.email) {
    const existingUser = await User.findOne({
      email: req.body.email,
      _id: { $ne: req.user.id },
    });
    if (existingUser && existingUser.id !== req.user.id) {
      return next(new ApiError(400, 'Email is already taken by another user.'));
    }
  }
  if (req.body.password || req.body.confirmPassword) {
    return next(new ApiError(400, userMessage.notForUpdatePassword));
  }

  // Remove field from req.body
  const filtered = filterPayload(req.body, [
    'role',
    'passwordChangedAt',
    'active',
    '_id',
  ]);

  const user = await User.findByIdAndUpdate(req.user.id, filtered, {
    new: true,
    runValidators: true,
  }).select('-active -__v -password -passwordChangedAt');

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // Unactive user
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.addFriend = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const friendId = req.params.userId;

  const toUser = await User.findById(friendId);
  const user = await User.findById(userId);

  if (!toUser || !user) {
    return next(new ApiError(404, 'User not found!'));
  }

  if (toUser.friends.includes(userId)) {
    return next(new ApiError(400, 'You are already friends.'));
  }

  if (user.requests.includes(friendId)) {
    return next(new ApiError(400, 'They already sent you a request.'));
  }

  let updatedUser;
  if (toUser.requests.includes(req.user.id)) {
    updatedUser = await User.findByIdAndUpdate(
      friendId,
      { $pull: { requests: req.user.id } },
      { new: true, runValidators: true, select: 'requests' }, // Trả về requests sau khi cập nhật
    );
    res.status(200).json({
      status: 'success',
      message: 'Friend request canceled.',
      data: updatedUser.requests,
    });
  } else {
    updatedUser = await User.findByIdAndUpdate(
      friendId,
      { $push: { requests: req.user.id } },
      { new: true, runValidators: true, select: 'requests' }, // Trả về requests sau khi cập nhật
    );
    res.status(200).json({
      status: 'success',
      message: 'Friend request sent.',
      data: updatedUser.requests,
    });
  }
});

exports.acceptRequest = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const friendId = req.params.userId;

  const toUser = await User.findById(friendId);
  const user = await User.findById(userId);

  if (!toUser || !user) {
    return next(new ApiError(404, 'User not found!'));
  }

  if (user.friends.includes(friendId)) {
    return next(new ApiError(400, 'You are already friends.'));
  }

  if (!user.requests.includes(friendId)) {
    return next(new ApiError(400, 'No friend request from this user.'));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { requests: friendId },
      $push: { friends: friendId },
    },
    { new: true, runValidators: true, select: 'friends requests' }, // Trả về friends và requests sau khi cập nhật
  );

  const updatedToUser = await User.findByIdAndUpdate(
    friendId,
    { $push: { friends: userId } },
    { new: true, runValidators: true, select: 'friends' }, // Trả về friends sau khi cập nhật
  );

  res.status(200).json({
    status: 'success',
    message: 'Friend request accepted.',
    data: {
      yourFriends: updatedUser.friends,
      yourRequests: updatedUser.requests,
      otherFriends: updatedToUser.friends,
    },
  });
});

exports.unFriend = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const friendId = req.params.userId;

  const toUser = await User.findById(friendId);
  const user = await User.findById(userId);

  if (!toUser) {
    return next(new ApiError(404, 'User not found.'));
  }

  if (!user.friends.includes(friendId)) {
    return next(new ApiError(400, 'This user is not your friend.'));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { friends: friendId } },
    { new: true, runValidators: true, select: 'friends' }, // Trả về friends sau khi cập nhật
  );

  const updatedToUser = await User.findByIdAndUpdate(
    friendId,
    { $pull: { friends: userId } },
    { new: true, runValidators: true, select: 'friends' }, // Trả về friends sau khi cập nhật
  );

  res.status(200).json({
    status: 'success',
    message: 'Friend removed.',
    data: {
      yourFriends: updatedUser.friends,
      otherFriends: updatedToUser.friends,
    },
  });
});

exports.findAllFriends = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new ApiError(404, 'User not found!'));
  }

  // Xây dựng bộ lọc
  const filter = { active: true, _id: { $in: user.friends } };
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  const friends = await User.find(filter);

  res.status(200).json({
    status: 'success',
    data: {
      friends,
    },
  });
});

exports.findAllRequests = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ApiError(404, 'User not found!'));
  }

  const requests = await User.find({
    active: true,
    _id: { $in: user.requests },
  });

  res.status(200).json({
    status: 'success',
    data: {
      requests,
    },
  });
});

exports.getOthers = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    return next(new ApiError(404, 'User not found!'));
  }

  // Truy vấn những user khác, không bao gồm user hiện tại, bạn bè và các yêu cầu kết bạn
  const otherUsers = await User.find({
    active: true, // Chỉ lấy những người dùng đang hoạt động
    role: { $ne: 'admin' },
    $and: [
      { _id: { $ne: currentUser._id } }, // Không lấy user hiện tại
      { _id: { $nin: currentUser.friends } }, // Không lấy bạn bè của user hiện tại
      { _id: { $nin: currentUser.requests } }, // Không lấy những người user hiện tại đã gửi yêu cầu kết bạn
    ],
  });

  res.status(200).json({
    status: 'success',
    data: { otherUsers },
  });
});

exports.getUserStatistics = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ active: true });
  const genderDistribution = await User.aggregate([
    {
      $group: {
        _id: '$gender',
        count: { $sum: 1 },
      },
    },
  ]);

  // Biểu đồ phân phối người dùng theo trạng thái active và role
  const roleDistribution = await User.aggregate([
    {
      $group: {
        _id: { active: '$active', role: '$role' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        active: '$_id.active',
        role: '$_id.role',
        count: 1,
      },
    },
    {
      $sort: { active: 1, role: 1 }, // Sắp xếp theo active và role
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      activeUsers,
      genderDistribution,
      roleDistribution,
    },
  });
});

