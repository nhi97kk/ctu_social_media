const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Answer = require('../models/answer.model');
const Question = require('../models/question.model');
const Topic = require('../models/topic.model');

// Helper function to get filter options
const getFilterOptions = (filter, userId) => {
  const options = { hide: false };

  switch (filter) {
    case 'Unanswered':
      options.answers = { $size: 0 };
      break;
    case 'Unsolved':
      options.isSolved = false;
      break;
    case 'Solved':
      options.isSolved = true;
      break;
    case 'YourQuestion':
      options.createdBy = userId;
      break;
  }

  return options;
};

exports.getFilterQuestions = catchAsync(async (req, res, next) => {
  const { filter, hide, sort } = req.query; // filter could be 'Recent', 'Unanswered', etc.
  const userId = req.user.id; // assuming we have user info in req.user
  const filterOptions = getFilterOptions(filter, userId);
  if (hide) filterOptions.hide = hide;

  // Determine the sorting options based on the query parameter
  let mongooseQuery = Question.find(filterOptions);

  if (sort === 'likes') {
    // Use aggregate to sort by the size of likesCount array (number of likes)
    mongooseQuery = Question.aggregate([
      { $match: filterOptions }, // Apply filter
      { $addFields: { likesCountSize: { $size: '$likes' } } }, // Calculate the number of likes (size of the likes array)
      { $sort: { likesCountSize: -1 } }, // Sort by the likes count, descending
      { $project: { likesCountSize: 0 } }, // Optionally remove the temporary likesCountSize field
    ]);
  } else if (sort === 'recent') {
    mongooseQuery = mongooseQuery.sort({ createdAt: -1 }); // Sort by created date, descending
  } else if (sort === 'views') {
    mongooseQuery = mongooseQuery.sort({ views: -1 }); // Sort by number of views, descending
  }

  const questions = await mongooseQuery;

  res.status(200).json({
    status: 'success',
    data: { questions },
  });
});

exports.getFilterQuestionsByTopic = catchAsync(async (req, res, next) => {
  const { topicId } = req.params;
  const { filter, sort } = req.query;
  const userId = req.user.id;
  const filterOptions = {
    ...getFilterOptions(filter, userId),
    topic: topicId,
  };
  // Determine the sorting options based on the query parameter
  let mongooseQuery = Question.find(filterOptions);

  if (sort === 'likes') {
    // Use aggregate to sort by the size of likesCount array (number of likes)
    mongooseQuery = Question.aggregate([
      { $match: filterOptions }, // Apply filter
      { $addFields: { likesCountSize: { $size: '$likes' } } }, // Calculate the number of likes (size of the likes array)
      { $sort: { likesCountSize: -1 } }, // Sort by the likes count, descending
      { $project: { likesCountSize: 0 } }, // Optionally remove the temporary likesCountSize field
    ]);
  } else if (sort === 'recent') {
    mongooseQuery = mongooseQuery.sort({ createdAt: -1 }); // Sort by created date, descending
  } else if (sort === 'views') {
    mongooseQuery = mongooseQuery.sort({ views: -1 }); // Sort by number of views, descending
  }

  const questions = await mongooseQuery;

  res.status(200).json({
    status: 'success',
    data: { questions },
  });
});

exports.searchQuestion = catchAsync(async (req, res, next) => {
  const { title } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false };
  // Tìm kiếm theo name (xử lý regex tại đây)
  if (title) {
    filter.title = { $regex: title, $options: 'i' };
  }

  let mongooseQuery = new MongooseQuery(Question.find(filter), {});
  mongooseQuery.filter().sort().paginate();

  const questions = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { questions },
  });
});

exports.getAllQuestion = catchAsync(async (req, res, next) => {
  const { hide, status } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false };
  if (hide) filter.hide = hide;
  if (status) filter.status = status;

  let mongooseQuery = new MongooseQuery(Question.find(filter), {});
  mongooseQuery.filter().sort().paginate();

  const questions = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { questions },
  });
});

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

exports.getQuestion = catchAsync(async (req, res, next) => {
  let question = await Question.findById(req.params.questionId).lean();

  if (!question) {
    return next(new ApiError(404, 'Cannot find question with this ID!'));
  }

  const userStats = await getUserStats(question.createdBy._id);
  question.createdBy = { ...question.createdBy, ...userStats };

  // Tăng `views` lên 1 nếu người dùng hiện tại không phải là người tạo câu hỏi
  if (!question.createdBy._id.equals(req.user.id)) {
    await Question.updateOne(
      { _id: req.params.questionId },
      { $inc: { views: 1 } },
    );
  }

  res.status(200).json({
    status: 'success',
    data: { question },
  });
});

exports.createQuestion = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const payload = { ...req.body, createdBy: userId };
  payload.images = [];

  const topic = await Topic.findById(payload.topic);

  if (!topic) {
    return next(new ApiError(404, 'Cannot find topic with this ID!'));
  }

  const question = await Question.create(payload);
  topic.questions.push(question._id);
  await topic.save();

  res.status(201).json({
    status: 'success',
    data: { question },
  });
});

exports.likeQuestion = catchAsync(async (req, res, next) => {
  const questionId = req.params.questionId;
  const userId = req.user.id;

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new ApiError(404, 'Cannot find question with this ID!'));
  }

  // Cập nhật likes và trả về câu hỏi đã cập nhật với danh sách likes mới nhất
  const updatedQuestion = await Question.findByIdAndUpdate(
    questionId,
    question.likes.includes(userId)
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } },
    { new: true }, // Đảm bảo trả về bản ghi mới sau khi cập nhật
  );

  res.status(200).json({
    status: 'success',
    data: updatedQuestion.likes,
  });
});

exports.updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(
    req.params.questionId,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!question) {
    return next(new ApiError(404, 'Cannot find question with this ID!'));
  }

  res.status(200).json({
    status: 'success',
    data: { question },
  });
});

exports.hideQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(
    req.params.questionId,
    { hide: true },
    { new: true, runValidators: true },
  );

  if (!question) {
    return next(new ApiError(404, 'Question does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.restoreQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(
    req.params.questionId,
    { hide: false },
    { new: true, runValidators: true },
  );

  if (!question) {
    return next(new ApiError(404, 'Question does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.questionId);

  if (!question) {
    return next(new ApiError(404, 'Cannot find topic with this ID!'));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getQuestionStatistics = catchAsync(async (req, res, next) => {
  const totalQuestions = await Question.countDocuments();

  // Thực hiện grouping theo ngày, tháng và năm
  const questionsPerDay = await Question.aggregate([
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
  const formattedQuestionsPerDay = questionsPerDay.map(question => {
    return {
      date: question.date,
      count: question.count,
    };
  });

  const questionStatusDistribution = await Question.aggregate([
    {
      $group: {
        _id: '$isSolved', // Nhóm theo isSolved (true hoặc false)
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: {
          $cond: {
            // Sử dụng điều kiện để thay thế giá trị _id
            if: { $eq: ['$_id', true] }, // Nếu _id là true
            then: 'Solved', // Chuyển thành 'Solved'
            else: 'Unsolved', // Nếu _id là false
          },
        },
        count: 1, // Giữ lại count
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalQuestions,
      questionsPerDay: formattedQuestionsPerDay,
      questionStatusDistribution,
    },
  });
});
