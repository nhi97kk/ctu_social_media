const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Page = require('../models/page.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

exports.searchPage = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false, status: 'approved' };
  // Tìm kiếm theo name (xử lý regex tại đây)
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  let mongooseQuery = new MongooseQuery(Page.find(filter), {});
  mongooseQuery.filter().sort().paginate();

  const pages = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { pages },
  });
});

exports.getAllPages = catchAsync(async (req, res, next) => {
  const { hide, status } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false };
  if (hide) filter.hide = hide;
  if (status) filter.status = status;

  let mongooseQuery = new MongooseQuery(Page.find(filter), {});
  mongooseQuery.filter().sort().paginate();

  const pages = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { pages },
  });
});

exports.getPage = catchAsync(async (req, res, next) => {
  const page = await Page.findById(req.params.pageId).populate({
    path: 'followers',
    select: '_id name avatar role',
  });

  if (!page) {
    return next(new ApiError(404, 'Cannot find page with this ID!'));
  }

  res.status(200).json({
    status: 'success',
    data: { page },
  });
});

exports.createPage = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const payload = { ...req.body, owner: userId };

  const page = await Page.create(payload);

  res.status(201).json({
    status: 'success',
    data: { page },
  });
});

exports.updatePage = catchAsync(async (req, res, next) => {
  const page = await Page.findByIdAndUpdate(
    req.params.pageId,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!page) {
    return next(new ApiError(404, 'Cannot find page with this ID!'));
  }

  res.status(200).json({
    status: 'success',
    data: { page },
  });
});

exports.updateApprovedPage = catchAsync(async (req, res, next) => {
  const page = await Page.findByIdAndUpdate(
    req.params.pageId,
    { status: 'approved' },
    { new: true, runValidators: true },
  );

  if (!page) {
    return next(new ApiError(404, 'Page does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: { page },
  });
});

exports.updateRejectedPage = catchAsync(async (req, res, next) => {
  const page = await Page.findByIdAndUpdate(
    req.params.pageId,
    { status: 'rejected' },
    { new: true, runValidators: true },
  );

  if (!page) {
    return next(new ApiError(404, 'Page does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: { page },
  });
});

exports.hidePage = catchAsync(async (req, res, next) => {
  const page = await Page.findByIdAndUpdate(
    req.params.pageId,
    { hide: true },
    { new: true, runValidators: true },
  );

  if (!page) {
    return next(new ApiError(404, 'Page does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.restorePage = catchAsync(async (req, res, next) => {
  const page = await Page.findByIdAndUpdate(
    req.params.pageId,
    { hide: false },
    { new: true, runValidators: true },
  );

  if (!page) {
    return next(new ApiError(404, 'Page does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deletePage = catchAsync(async (req, res, next) => {
  const page = await Page.findByIdAndDelete(req.params.pageId);

  if (!page) {
    return next(new ApiError(404, 'Page does not exist.'));
  }

  // Tìm các bài viết liên quan đến Page
  const posts = await Post.find({ posted_on: page._id });

  // Lấy ID của các bài viết tìm được
  const postIds = posts.map(post => post._id.toString());

  // Tìm các bài viết được chia sẻ từ những bài viết này
  const sharedPosts = await Post.find({ shared_from: { $in: postIds } });
  const sharedPostIds = sharedPosts.map(post => post._id.toString());

  // Tìm tất cả bình luận của các bài viết (bao gồm bài viết gốc và bài viết chia sẻ)
  const allPostIds = [...postIds, ...sharedPostIds];
  await Comment.deleteMany({ post: { $in: allPostIds } });

  // Xóa tất cả bài viết chia sẻ
  await Post.deleteMany({ _id: { $in: sharedPostIds } });

  // Xóa tất cả bài viết gốc
  await Post.deleteMany({ _id: { $in: postIds } });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.followPage = catchAsync(async (req, res, next) => {
  const pageId = req.params.pageId;
  const userId = req.user.id;

  const page = await Page.findById(pageId);
  if (!page) {
    return next(new ApiError(404, 'Page does not exist.'));
  }

  // Cập nhật followers và trả về câu hỏi đã cập nhật với danh sách followers mới nhất
  const updatedPage = await Page.findByIdAndUpdate(
    pageId,
    page.followers.includes(userId)
      ? { $pull: { followers: userId } }
      : { $push: { followers: userId } },
    { new: true }, // Đảm bảo trả về bản ghi mới sau khi cập nhật
  );

  res.status(200).json({
    status: 'success',
    data: updatedPage.followers,
  });
});

exports.getAllUserPages = catchAsync(async (req, res, next) => {
  const pages = await Page.find({ owner: req.params.userId, hide: false });

  res.status(200).json({
    status: 'success',
    data: { pages },
  });
});

exports.getSuggestPages = catchAsync(async (req, res, next) => {
  const pages = await Page.find({
    hide: false,
    status: 'approved',
    owner: { $ne: req.user.id },
    followers: { $nin: [req.user.id] },
  });

  res.status(200).json({
    status: 'success',
    data: { pages },
  });
});

exports.getFollowedPages = catchAsync(async (req, res, next) => {
  const pages = await Page.find({
    hide: false,
    status: 'approved',
    followers: { $in: [req.user.id] },
  });

  res.status(200).json({
    status: 'success',
    data: { pages },
  });
});
