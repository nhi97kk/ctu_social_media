const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Comment = require('../models/comment.model');
const Post = require('../models/post.model');

exports.getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(
      new ApiError(404, 'Không tìm thấy bình luận với ID tương ứng!'),
    );
  }

  res.status(200).json({
    status: 'success',
    data: { comment },
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const { hide } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false };
  if (hide) filter.hide = hide;

  let mongooseQuery = new MongooseQuery(Comment.find(filter), {});
  mongooseQuery.filter().sort().paginate();

  const comments = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { comments },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const { desc } = req.body;
  const { postId } = req.params;

  // Kiểm tra xem post có tồn tại không
  const post = await Post.findById(postId);
  if (!post) {
    return next(new ApiError(404, 'Không tìm thấy bài viết với ID tương ứng!'));
  }

  // Tạo bình luận mới
  const comment = await Comment.create({
    desc: desc,
    post: postId,
    user: req.user.id,
  });

  // Thêm comment vào danh sách comment của post
  post.comments.push(comment._id);
  await post.save();

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!comment) {
    return next(
      new ApiError(404, 'Không tìm thấy bình luận với ID tương ứng!'),
    );
  }

  res.status(200).json({
    status: 'success',
    data: { comment },
  });
});

exports.hideComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    { hide: true },
    { new: true, runValidators: true },
  );

  if (!comment) {
    return next(new ApiError(404, 'Comment does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.restoreComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    { hide: false },
    { new: true, runValidators: true },
  );

  if (!comment) {
    return next(new ApiError(404, 'Comment does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.commentId);
  const post = await Post.findById(comment.post._id);

  if (!post) {
    return next(new ApiError(404, 'Post does not exist.'));
  }

  if (!comment) {
    return next(new ApiError(404, 'Comment does not exist.'));
  }

  post.comments.pull(comment._id);
  await post.save();

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.getAllCommentsPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).populate({
    path: 'likes',
    select: '_id name avatar role',
  });
  if (!post) {
    return next(new ApiError(404, 'Post does not exist.'));
  }

  const data = await Comment.find({ post: req.params.postId, hide: false });

  res.status(200).json({
    status: 'success',
    data: { data },
    likeList: post.likes,
  });
});

exports.likeComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;
  const userId = req.user.id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new ApiError(404, 'Cannot find comment with this ID!'));
  }

  // Cập nhật likes và trả về câu hỏi đã cập nhật với danh sách likes mới nhất
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    comment.likes.includes(userId)
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } },
    { new: true }, // Đảm bảo trả về bản ghi mới sau khi cập nhật
  );

  res.status(200).json({
    status: 'success',
    data: updatedComment.likes,
  });
});
