const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Group = require('../models/group.model');
const User = require('../models/user.model');

exports.searchGroup = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false, status: 'approved' };
  // Tìm kiếm theo name (xử lý regex tại đây)
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  let mongooseQuery = new MongooseQuery(Group.find(filter), {});
  mongooseQuery.filter().sort().paginate();

  const groups = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { groups },
  });
});

exports.getAllGroups = catchAsync(async (req, res, next) => {
  const { hide, status } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false };
  if (hide) filter.hide = hide;
  if (status) filter.status = status;

  let mongooseQuery = new MongooseQuery(Group.find(filter), {});
  mongooseQuery.filter().sort().paginate();

  const groups = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { groups },
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId).populate({
    path: 'owner',
    select: '_id name avatar role',
  });

  if (!group) {
    return next(new ApiError(404, 'Cannot find group with this ID!'));
  }

  res.status(200).json({
    status: 'success',
    data: { group },
  });
});

exports.createGroup = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const payload = { ...req.body, owner: userId };

  const group = await Group.create(payload);

  res.status(201).json({
    status: 'success',
    data: { group },
  });
});

exports.updateGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(
    req.params.groupId,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!group) {
    return next(new ApiError(404, 'Cannot find group with this ID!'));
  }

  res.status(200).json({
    status: 'success',
    data: { group },
  });
});

exports.updateApprovedGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(
    req.params.groupId,
    { status: 'approved' },
    { new: true, runValidators: true },
  );

  if (!group) {
    return next(new ApiError(404, 'Group does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: { group },
  });
});

exports.updateRejectedGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(
    req.params.groupId,
    { status: 'rejected' },
    { new: true, runValidators: true },
  );

  if (!group) {
    return next(new ApiError(404, 'Group does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: { group },
  });
});

exports.hideGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(
    req.params.groupId,
    { hide: true },
    { new: true, runValidators: true },
  );

  if (!group) {
    return next(new ApiError(404, 'Group does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.restoreGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(
    req.params.GroupId,
    { hide: false },
    { new: true, runValidators: true },
  );

  if (!group) {
    return next(new ApiError(404, 'Group does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndDelete(req.params.groupId);

  if (!group) {
    return next(new ApiError(404, 'Cannot find group with this ID!'));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUserGroups = catchAsync(async (req, res, next) => {
  const groups = await Group.find({ owner: req.params.userId, hide: false });

  res.status(200).json({
    status: 'success',
    data: { groups },
  });
});

exports.getSuggestGroups = catchAsync(async (req, res, next) => {
  const groups = await Group.find({
    hide: false,
    status: 'approved',
    owner: { $ne: req.user.id },
    members: { $nin: [req.user.id] },
  });

  res.status(200).json({
    status: 'success',
    data: { groups },
  });
});

exports.getJoinedGroups = catchAsync(async (req, res, next) => {
  const groups = await Group.find({
    hide: false,
    status: 'approved',
    members: { $in: [req.user.id] },
  });

  res.status(200).json({
    status: 'success',
    data: { groups },
  });
});

exports.sendJoinRequest = catchAsync(async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new ApiError(404, 'Group not found'));
  }

  let updatedGroup;

  // Kiểm tra xem người dùng đã gửi yêu cầu chưa
  if (group.requests.includes(userId)) {
    updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $pull: { requests: userId } },
      { new: true, runValidators: true, select: 'requests' }, // Trả về friends sau khi cập nhật
    );
  } else {
    updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $push: { requests: userId } },
      { new: true, runValidators: true, select: 'requests' }, // Trả về friends sau khi cập nhật
    );
  }

  res.status(200).json({
    status: 'success',
    data: updatedGroup.requests,
  });
});

// Chấp nhận yêu cầu tham gia nhóm
exports.acceptJoinRequest = catchAsync(async (req, res, next) => {
  const { groupId, userId } = req.params;

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new ApiError(404, 'Group not found'));
  }

  // Kiểm tra xem yêu cầu có trong danh sách requests không
  if (!group.requests.includes(userId)) {
    return next(new ApiError(400, 'No request found from this user'));
  }

  // Xóa yêu cầu và thêm người dùng vào danh sách members
  group.requests.pull(userId);
  group.members.push(userId);
  await group.save();

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// Rời nhóm
exports.leaveGroup = catchAsync(async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new ApiError(404, 'Group not found.'));
  }

  // Kiểm tra xem người dùng có phải là thành viên không
  if (!group.members.includes(userId)) {
    return next(new ApiError(400, 'You are not a member of this group.'));
  }

  const updatedGroup = await Group.findByIdAndUpdate(
    groupId,
    { $pull: { members: userId } },
    { new: true, runValidators: true, select: 'members' }, // Trả về friends sau khi cập nhật
  );

  res.status(200).json({
    status: 'success',
    data: updatedGroup.members,
  });
});

// Rời nhóm
exports.deleteMember = catchAsync(async (req, res, next) => {
  const { groupId, userId } = req.params;

  const group = await Group.findById(groupId);

  if (!group) {
    return next(new ApiError(404, 'Group not found'));
  }

  // Kiểm tra xem người dùng có phải là thành viên không
  if (!group.members.includes(userId)) {
    return next(new ApiError(400, 'User are not a member of this group'));
  }

  // Xóa người dùng khỏi danh sách members
  group.members.pull(userId);
  await group.save();

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// Controller để lấy danh sách yêu cầu tham gia nhóm
exports.getGroupJoinRequests = catchAsync(async (req, res, next) => {
  const groupId = req.params.groupId;

  // Tìm nhóm theo ID và populate với thông tin người dùng từ requests
  const group = await Group.findById(groupId).populate({
    path: 'requests', // Tên trường cần populate
    select: '_id name avatar', // Chỉ lấy trường id và avatar của người dùng
  });

  if (!group) {
    return next(new ApiError(404, 'Group not found!'));
  }

  // Lấy danh sách người dùng từ requests
  const users = group.requests;

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

// Controller để lấy danh sách thành viên nhóm
exports.getGroupMembers = catchAsync(async (req, res, next) => {
  const groupId = req.params.groupId;

  // Tìm nhóm theo ID và populate với thông tin người dùng từ members
  const group = await Group.findById(groupId).populate({
    path: 'members', // Tên trường cần populate
    select: '_id name avatar', // Chỉ lấy trường id và avatar của người dùng
  });

  if (!group) {
    return next(new ApiError(404, 'Group not found!'));
  }

  // Lấy danh sách người dùng từ members
  const users = group.members;

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
