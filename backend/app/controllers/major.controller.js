const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Major = require('../models/major.model');

exports.searchMajor = catchAsync(async (req, res, next) => {
  req.query.name = { $regex: req.query.name, $options: 'i' };
  next();
});

exports.getAllMajor = catchAsync(async (req, res, next) => {
  let mongooseQuery = new MongooseQuery(Major.find(), { ...req.query });
  mongooseQuery.filter().sort().paginate();

  const majors = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { majors },
  });
});

exports.getMajor = catchAsync(async (req, res, next) => {
  const major = await Major.findById(req.params.majorId);

  if (!major) {
    return next(new ApiError(404, 'Khong tim thay Nha Xuat Ban'));
  }

  res.status(200).json({
    status: 'success',
    data: { major },
  });
});

exports.createMajor = catchAsync(async (req, res, next) => {
  const major = await Major.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: major,
    },
  });
});

exports.updateMajor = catchAsync(async (req, res, next) => {
  const major = await Major.findByIdAndUpdate(req.params.majorId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!major) {
    return next(new AppError('No major found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: major,
    },
  });
});

exports.deleteMajor = catchAsync(async (req, res, next) => {
  const major = await Major.findByIdAndDelete(req.params.majorId);

  if (!major) {
    return next(new ApiError(404, 'Major does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
