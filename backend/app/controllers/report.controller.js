const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Report = require('../models/report.model');

// Supported models to check against
const models = {
  Post: require('../models/post.model'),
  Question: require('../models/question.model'),
  Answer: require('../models/answer.model'),
  User: require('../models/user.model'),
  Comment: require('../models/comment.model'),
  Page: require('../models/page.model'),
  Group: require('../models/group.model'),
};

exports.createReport = catchAsync(async (req, res, next) => {
  const { targetId, targetModel } = req.body;

  // Check if the targetModel is valid and exists in models object
  if (!models[targetModel]) {
    return next(new ApiError(400, 'Invalid target model!'));
  }

  // Verify if the target document exists
  const targetDoc = await models[targetModel].findById(targetId);
  if (!targetDoc) {
    return next(new ApiError(404, `Cannot find ${targetModel} with this ID!`));
  }

  // If the target exists, proceed with report creation
  const userId = req.user.id;
  const payload = { ...req.body, actor: userId };

  const report = await Report.create(payload);

  res.status(201).json({
    status: 'success',
    data: { report },
  });
});

exports.resolveReports = catchAsync(async (req, res, next) => {
  const { targetId, targetModel } = req.params;

  // Check if the targetModel is valid
  if (!models[targetModel]) {
    return next(new ApiError(400, 'Invalid target model!'));
  }

  // Update all reports associated with this target to "resolved"
  await Report.updateMany(
    { targetId, targetModel, status: 'pending' },
    { status: 'resolved' },
  );

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.rejectReports = catchAsync(async (req, res, next) => {
  const { targetId, targetModel } = req.params;

  // Check if the targetModel is valid
  if (!models[targetModel]) {
    return next(new ApiError(400, 'Invalid target model!'));
  }

  // Update all reports associated with this target to "rejected"
  await Report.updateMany(
    { targetId, targetModel, status: 'pending' },
    { status: 'rejected' },
  );

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.resolveReport = catchAsync(async (req, res, next) => {
  const { reportId } = req.params;

  // Find the report by ID
  const report = await Report.findByIdAndUpdate(
    reportId,
    { status: 'resolved' },
    { new: true, runValidators: true },
  );

  if (!report) {
    return next(new ApiError(404, 'Report not found!'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.rejectReport = catchAsync(async (req, res, next) => {
  const { reportId } = req.params;

  // Find the report by ID
  const report = await Report.findByIdAndUpdate(
    reportId,
    { status: 'rejected' },
    { new: true, runValidators: true },
  );

  if (!report) {
    return next(new ApiError(404, 'Report not found!'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteReport = catchAsync(async (req, res, next) => {
  const { reportId } = req.params;

  // Find the report by ID
  const report = await Report.findByIdAndDelete(reportId);

  if (!report) {
    return next(new ApiError(404, 'Report not found!'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.getAllReport = catchAsync(async (req, res, next) => {
  const { hide, status, targetModel, targetId } = req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false };
  if (hide) filter.hide = hide;
  if (targetModel) filter.targetModel = targetModel;
  if (targetId) filter.targetId = targetId;
  if (status) filter.status = status;

  // Áp dụng bộ lọc trong find()
  const mongooseQuery = new MongooseQuery(
    Report.find(filter).populate({
      path: 'actor',
      select: '_id name avatar',
    }),
    {},
  );

  const reports = await mongooseQuery.filter().sort().paginate().query;

  res.status(200).json({
    status: 'success',
    data: { reports },
  });
});

exports.hideReport = catchAsync(async (req, res, next) => {
  const report = await Report.findByIdAndUpdate(
    req.params.reportId,
    { hide: true },
    { new: true, runValidators: true },
  );

  if (!report) {
    return next(new ApiError(404, 'Report does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.restoreReport = catchAsync(async (req, res, next) => {
  const report = await Report.findByIdAndUpdate(
    req.params.reportId,
    { hide: false },
    { new: true, runValidators: true },
  );

  if (!report) {
    return next(new ApiError(404, 'Report does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.getReportStatistics = catchAsync(async (req, res, next) => {
  const totalReports = await Report.countDocuments();

  // Thực hiện grouping theo ngày, tháng và năm
  const reportsPerDay = await Report.aggregate([
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
  const formattedReportsPerDay = reportsPerDay.map(report => {
    return {
      date: report.date,
      count: report.count,
    };
  });

  const reportStatusDistribution = await Report.aggregate([
    {
      $group: {
        _id: '$status', // Nhóm theo isSolved (true hoặc false)
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalReports,
      reportsPerDay: formattedReportsPerDay,
      reportStatusDistribution,
    },
  });
});
