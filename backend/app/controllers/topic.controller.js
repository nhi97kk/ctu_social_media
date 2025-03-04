const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Topic = require('../models/topic.model');

exports.searchTopic = catchAsync(async (req, res, next) => {
  req.query.name = { $regex: req.query.name, $options: 'i' };
  next();
});

exports.getAllTopic = catchAsync(async (req, res, next) => {
  let mongooseQuery = new MongooseQuery(Topic.find(), req.query);
  mongooseQuery.filter().sort().paginate();

  const topics = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { topics },
  });
});

exports.getTopic = catchAsync(async (req, res, next) => {
  const topic = await Topic.findById(req.params.topicId);

  if (!topic) {
    return next(new ApiError(404, 'Cannot find topic with this ID!'));
  }

  res.status(200).json({
    status: 'success',
    data: { topic },
  });
});

exports.createTopic = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const payload = { ...req.body, createdBy: userId };

  const topic = await Topic.create(payload);

  res.status(201).json({
    status: 'success',
    data: { topic },
  });
});

exports.updateTopic = catchAsync(async (req, res, next) => {
  const topic = await Topic.findByIdAndUpdate(
    req.params.topicId,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!topic) {
    return next(new ApiError(404, 'Cannot find topic with this ID!'));
  }

  res.status(200).json({
    status: 'success',
    data: { topic },
  });
});

exports.hideTopic = catchAsync(async (req, res, next) => {
  const topic = await Topic.findByIdAndUpdate(
    req.params.topicId,
    { hide: true },
    { new: true, runValidators: true },
  );

  if (!topic) {
    return next(new ApiError(404, 'Topic does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteTopic = catchAsync(async (req, res, next) => {
  const topic = await Topic.findByIdAndDelete(req.params.topicId);

  if (!topic) {
    return next(new ApiError(404, 'Topic does not exist!'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
