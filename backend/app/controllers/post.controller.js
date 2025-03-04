const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Post = require('../models/post.model');
const User = require('../models/user.model');
const Page = require('../models/page.model');
const Group = require('../models/group.model');

exports.searchPost = catchAsync(async (req, res, next) => {
  const { desc, posted_on, onModel } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false, shared_from: null };
  if (desc) {
    filter.desc = { $regex: desc, $options: 'i' };
  }
  if (posted_on) {
    filter.posted_on = posted_on;
  }

  if (onModel) {
    filter.onModel = onModel;
  }

  let mongooseQuery = new MongooseQuery(Post.find(filter), {});
  mongooseQuery.filter().sort().paginate();

  const posts = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { posts },
  });
});

exports.getAllPost = catchAsync(async (req, res, next) => {
  const { hide, onModel } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false };
  if (hide) filter.hide = hide;
  if (onModel) filter.onModel = onModel;

  let mongooseQuery = new MongooseQuery(
    Post.find(filter).populate({
      path: 'posted_on',
    }),
    {},
  );
  mongooseQuery.filter().sort().paginate();

  const posts = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { posts },
  });
});

exports.getNewsFeed = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Fetch the current user’s friends, pages they own, and groups they own
  const user = await User.findById(userId, 'friends');
  const friendIds = user.friends;

  // Define conditions for post visibility based on user relations
  const postConditions = {
    hide: false, // Mandatory condition
    onModel: 'User',
    $or: [
      { user: userId }, // User's own posts
      { user: { $in: friendIds } }, // Posts from friends
    ],
  };

  // Create the query with filter, sort, and paginate methods
  let mongooseQuery = new MongooseQuery(Post.find(postConditions), {});
  mongooseQuery.sort();

  // Execute the query and retrieve posts
  const posts = await mongooseQuery.query;

  // Return the results
  res.status(200).json({
    status: 'success',
    data: { posts },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new ApiError(404, 'Không tìm thấy bài viết với ID tương ứng!'));
  }

  res.status(200).json({
    status: 'success',
    data: { post },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const payload = { ...req.body, posted_by: userId, user: userId };
  payload.images = [];

  const post = await Post.create(payload);

  res.status(201).json({
    status: 'success',
    data: { post },
  });
});

exports.sharePost = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await Post.findById(req.params.postId);
  if (!post) {
    return next(new ApiError(404, 'Không tìm thấy bài viết với ID tương ứng!'));
  }

  // Tạo một bài viết mới cho user A nhưng liên kết tới bài viết gốc (user B)
  const payload = {
    ...req.body,
    onModel: 'User',
    posted_on: userId,
    posted_by: userId,
    user: userId,
    shared_from: postId,
  };
  const sharedPost = await Post.create(payload);

  // Cập nhật số lượng chia sẻ của bài viết gốc
  post.shares += 1;
  await post.save();

  res.status(201).json({
    status: 'success',
    data: { sharedPost },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!post) {
    return next(new ApiError(404, 'Không tìm thấy bài viết với ID tương ứng!'));
  }

  res.status(200).json({
    status: 'success',
    data: { post },
  });
});

exports.hidePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { hide: true },
    { new: true, runValidators: true },
  );

  if (!post) {
    return next(new ApiError(404, 'Post does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.restorePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { hide: false },
    { new: true, runValidators: true },
  );

  if (!post) {
    return next(new ApiError(404, 'Post does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.postId);

  if (!post) {
    return next(new ApiError(404, 'Post does not exist.'));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.likePost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ApiError(404, 'Cannot find post with this ID!'));
  }

  // Cập nhật likes và trả về câu hỏi đã cập nhật với danh sách likes mới nhất
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    post.likes.includes(userId)
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } },
    { new: true }, // Đảm bảo trả về bản ghi mới sau khi cập nhật
  );

  const likeList = await updatedPost.populate({
    path: 'likes',
    select: '_id name avatar role',
  });

  const likes = likeList.likes.map(like => like._id);

  res.status(200).json({
    status: 'success',
    data: likes,
    likeList: likeList.likes,
  });
});

exports.getAllUserPosts = catchAsync(async (req, res, next) => {
  // Define conditions for post visibility based on user relations
  const postConditions = {
    hide: false, // Mandatory condition
    onModel: 'User',
    posted_on: req.params.userId,
  };

  // Create the query with filter, sort, and paginate methods
  let mongooseQuery = new MongooseQuery(Post.find(postConditions), {});
  mongooseQuery.sort();

  // Execute the query and retrieve posts
  const posts = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { posts },
  });
});

exports.getAllPagePosts = catchAsync(async (req, res, next) => {
  // Define conditions for post visibility based on user relations
  const postConditions = {
    hide: false, // Mandatory condition
    onModel: 'Page',
    posted_on: req.params.pageId,
  };

  // Create the query with filter, sort, and paginate methods
  let mongooseQuery = new MongooseQuery(Post.find(postConditions), {});
  mongooseQuery.sort();

  // Execute the query and retrieve posts
  const posts = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { posts },
  });
});

exports.getAllPagesPosts = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Get pages and groups the user owns or follows/has joined
  const ownedPages = await Page.find({ owner: userId, hide: false }, '_id');
  const followedPages = await Page.find(
    { followers: userId, hide: false },
    '_id',
  );

  // Create arrays of IDs
  const ownedPageIds = ownedPages.map(page => page._id);
  const followedPageIds = followedPages.map(page => page._id);

  // Define conditions for post visibility based on user relations
  const postConditions = {
    hide: false, // Mandatory condition
    onModel: 'Page',
    $or: [
      { posted_on: { $in: ownedPageIds } }, // Posts from user's pages
      { posted_on: { $in: followedPageIds } }, // Posts from pages the user follows
    ],
  };

  // Create the query with filter, sort, and paginate methods
  let mongooseQuery = new MongooseQuery(Post.find(postConditions), {});
  mongooseQuery.sort();

  // Execute the query and retrieve posts
  const posts = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { posts },
  });
});

exports.getAllGroupPosts = catchAsync(async (req, res, next) => {
  // Define conditions for post visibility based on user relations
  const postConditions = {
    hide: false, // Mandatory condition
    onModel: 'Group',
    posted_on: req.params.groupId,
  };

  // Create the query with filter, sort, and paginate methods
  let mongooseQuery = new MongooseQuery(Post.find(postConditions), {});
  mongooseQuery.sort();

  // Execute the query and retrieve posts
  const posts = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { posts },
  });
});

exports.getAllGroupsPosts = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Get pages and groups the user owns or follows/has joined
  const ownedGroups = await Group.find({ owner: userId, hide: false }, '_id');
  const memberGroups = await Group.find(
    { members: userId, hide: false },
    '_id',
  );

  // Create arrays of IDs
  const ownedGroupIds = ownedGroups.map(group => group._id);
  const memberGroupIds = memberGroups.map(group => group._id);

  // Define conditions for post visibility based on user relations
  const postConditions = {
    hide: false, // Mandatory condition
    onModel: 'Group',
    $or: [
      { posted_on: { $in: ownedGroupIds } }, // Posts from user's groups
      { posted_on: { $in: memberGroupIds } }, // Posts from groups the user has joined
    ],
  };

  // Create the query with filter, sort, and paginate methods
  let mongooseQuery = new MongooseQuery(Post.find(postConditions), {});
  mongooseQuery.sort();

  // Execute the query and retrieve posts
  const posts = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { posts },
  });
});

const moment = require('moment'); // Đảm bảo đã cài moment

exports.getPostStatistics = catchAsync(async (req, res, next) => {
  const totalPosts = await Post.countDocuments();

  // Thực hiện grouping theo ngày, tháng và năm
  const postsPerDay = await Post.aggregate([
    {
      $project: {
        day: { $dayOfMonth: '$createdAt' },
        month: { $month: '$createdAt' },
        year: { $year: '$createdAt' },
      },
    },
    {
      $group: {
        _id: { day: '$day', month: '$month', year: '$year' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $concat: [
            { $toString: '$_id.month' },
            '/',
            { $toString: '$_id.day' },
          ],
        },
        count: 1,
      },
    },
  ]);

  // Biến đổi ngày tháng thành định dạng 'MM/DD'
  const formattedPostsPerDay = postsPerDay.map(post => {
    return {
      date: post.date,
      count: post.count,
    };
  });

  const postStatusDistribution = await Post.aggregate([
    {
      $group: {
        _id: '$onModel',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalPosts,
      postsPerDay: formattedPostsPerDay,
      postStatusDistribution,
    },
  });
});
