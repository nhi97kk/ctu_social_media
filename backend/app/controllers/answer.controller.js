const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Answer = require('../models/answer.model');
const Question = require('../models/question.model');

exports.searchAnswer = catchAsync(async (req, res, next) => {
  req.query.slug = { $regex: req.query.slug, $options: 'i' };
  next();
});

exports.getAllAnswer = catchAsync(async (req, res, next) => {
  const { hide, isSolution } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false };
  if (hide) filter.hide = hide;
  if (isSolution) filter.isSolution = isSolution;

  let mongooseQuery = new MongooseQuery(Answer.find(filter), {});
  mongooseQuery.filter().sort().paginate();

  const answers = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { answers },
  });
});

function buildAnswerTree(answers, parentId = null) {
  return answers
    .filter(
      answer =>
        (answer.parentAnswer ? answer.parentAnswer.toString() : null) ===
        (parentId ? parentId.toString() : null),
    )
    .map(answer => ({
      ...answer,
      replies: buildAnswerTree(answers, answer._id),
    }));
}

const getUserStats = async userId => {
  const allAnswersCount = await Answer.countDocuments({
    createdBy: userId,
    hide: false,
  });
  const allSolutionCount = await Answer.countDocuments({
    createdBy: userId,
    isSolution: true,
    hide: false,
  });

  // Lấy tổng số lượng likes từ tất cả các câu trả lời của người dùng
  const allLikedAnswers = await Answer.find(
    { createdBy: userId, hide: false },
    'likes',
  ).lean();
  const totalLikesCount = allLikedAnswers.reduce(
    (sum, answer) => sum + answer.likes.length,
    0,
  );

  return { allAnswersCount, allSolutionCount, totalLikesCount };
};

exports.getAllAnswerByQuestion = catchAsync(async (req, res, next) => {
  // Lấy tất cả câu trả lời theo questionId và sắp xếp theo thứ tự cũ nhất -> mới nhất
  let answers = await Answer.find({
    // hide: false,
    question: req.params.questionId,
  })
    .sort({ createdAt: 1 })
    .lean();

  const countAns = answers.length;

  // Tạo danh sách các promises để lấy thông tin stats của từng người dùng song song
  const userStatsPromises = answers.map(async answer => {
    if (answer.createdBy) {
      const userStats = await getUserStats(answer.createdBy._id);
      answer.createdBy = { ...answer.createdBy, ...userStats };
    }
    return answer;
  });

  // Đợi tất cả promises hoàn tất
  answers = await Promise.all(userStatsPromises);

  // Xây dựng cấu trúc cây cho câu trả lời
  answers = buildAnswerTree(answers);

  res.status(200).json({
    status: 'success',
    data: { answers, countAns },
  });
});

exports.getSolutions = catchAsync(async (req, res, next) => {
  // Lấy tất cả các câu trả lời đã đánh dấu là giải pháp (isSolution: true) và ẩn (hide: false)
  let answers = await Answer.find({
    hide: false,
    question: req.params.questionId,
    isSolution: true,
  })
    .sort({ createdAt: 1 })
    .lean();

  // Tạo danh sách các promises để lấy thông tin stats của từng người dùng song song
  const userStatsPromises = answers.map(async answer => {
    if (answer.createdBy) {
      const userStats = await getUserStats(answer.createdBy._id);
      answer.createdBy = { ...answer.createdBy, ...userStats };
      answer.replies = [];
      answer.hideActions = true;
    }
    return answer;
  });

  // Đợi tất cả promises hoàn tất
  answers = await Promise.all(userStatsPromises);

  res.status(200).json({
    status: 'success',
    data: { answers },
  });
});

exports.getAnswer = catchAsync(async (req, res, next) => {
  const answer = await Answer.findById(req.params.answerId);

  if (!answer) {
    return next(new ApiError(404, 'Cannot find answer with this ID!'));
  }

  res.status(200).json({
    status: 'success',
    data: { answer },
  });
});

exports.createAnswer = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const payload = { ...req.body, createdBy: userId };
  payload.images = [];

  const question = await Question.findById(payload.question);

  if (!question) {
    return next(new ApiError(404, 'Cannot find question with this ID!'));
  }

  // Tạo câu trả lời và lưu nó
  let answer = await Answer.create(payload);

  // Sử dụng trực tiếp populate thay cho execPopulate
  answer = await answer.populate('createdBy', '_id name avatar role');

  question.answers.push(answer._id);
  await question.save();

  res.status(201).json({
    status: 'success',
    data: { answer },
  });
});

exports.acceptAsSolution = catchAsync(async (req, res, next) => {
  const answer = await Answer.findByIdAndUpdate(req.params.answerId, {
    isSolution: true,
  });

  if (!answer) {
    return next(new ApiError(404, 'Cannot find answer with this ID!'));
  }

  await Question.findByIdAndUpdate(answer.question, { isSolved: true });

  res.status(200).json({
    status: 'success',
    data: { answer },
  });
});

exports.likeAnswer = catchAsync(async (req, res, next) => {
  const answerId = req.params.answerId;
  const userId = req.user.id;

  const answer = await Answer.findById(answerId);
  if (!answer) {
    return next(new ApiError(404, 'Cannot find answer with this ID!'));
  }

  // Cập nhật likes và trả về câu hỏi đã cập nhật với danh sách likes mới nhất
  const updatedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    answer.likes.includes(userId)
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } },
    { new: true }, // Đảm bảo trả về bản ghi mới sau khi cập nhật
  );

  res.status(200).json({
    status: 'success',
    data: updatedAnswer.likes,
  });
});

exports.updateAnswer = catchAsync(async (req, res, next) => {
  const answer = await Answer.findByIdAndUpdate(req.params.answerId, {
    ...req.body,
  });

  if (!answer) {
    return next(new ApiError(404, 'Cannot find answer with this ID!'));
  }

  res.status(200).json({
    status: 'success',
    data: { answer },
  });
});

exports.hideAnswer = catchAsync(async (req, res, next) => {
  const answer = await Answer.findByIdAndUpdate(
    req.params.answerId,
    { hide: true },
    { new: true, runValidators: true },
  );

  if (!answer) {
    return next(new ApiError(404, 'Answer does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.restoreAnswer = catchAsync(async (req, res, next) => {
  const answer = await Answer.findByIdAndUpdate(
    req.params.answerId,
    { hide: false },
    { new: true, runValidators: true },
  );

  if (!answer) {
    return next(new ApiError(404, 'Answer does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
