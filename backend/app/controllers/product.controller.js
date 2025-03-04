const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');
const { productMessage } = require('../languages');

const Product = require('../models/product.model');

exports.getAllProduct = catchAsync(async (req, res, next) => {
  const { createdBy, hide, type, status, price_min, price_max, name } =
    req.query;

  // Xây dựng bộ lọc
  const filter = { hide: false };
  if (hide) filter.hide = hide;
  if (createdBy) filter.createdBy = createdBy;
  if (type) filter.type = type;
  if (status) filter.status = status;
  // Tìm kiếm theo name (xử lý regex tại đây)
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }
  if (price_min || price_max) {
    filter.price = {};
    if (price_min) filter.price.$gte = Number(price_min);
    if (price_max) filter.price.$lte = Number(price_max);
  }

  // Áp dụng bộ lọc trong find()
  const mongooseQuery = new MongooseQuery(Product.find(filter), {});

  const products = await mongooseQuery.filter().sort().paginate().query;

  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate({
    path: 'createdBy',
  });

  if (!product) {
    return next(
      new ApiError(
        404,
        productMessage.productNotFound.replace(
          '{{productId}}',
          req.params.productId,
        ),
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const payload = { ...req.body, createdBy: userId };
  payload.images = [];

  const product = await Product.create(payload);

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

exports.getFilterProduct = catchAsync(async (req, res, next) => {
  const { status } = req.query; // status có thể là 'pending', 'approved', 'sold'

  const products = await Product.find({
    createdBy: req.user.id,
    status,
    hide: false,
  });

  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

exports.getAllFilterProduct = catchAsync(async (req, res, next) => {
  const { status } = req.query; // status có thể là 'pending', 'approved', 'sold'

  const products = await Product.find({ status, hide: false });

  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

exports.updateSoldProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { status: 'sold' },
    { new: true, runValidators: true },
  );

  if (!product) {
    return next(
      new ApiError(
        404,
        productMessage.productNotFound.replace(
          '{{productId}}',
          req.params.productId,
        ),
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

exports.updateApprovedProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { status: 'approved' },
    { new: true, runValidators: true },
  );

  if (!product) {
    return next(
      new ApiError(
        404,
        productMessage.productNotFound.replace(
          '{{productId}}',
          req.params.productId,
        ),
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

exports.updateRejectedProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { status: 'rejected' },
    { new: true, runValidators: true },
  );

  if (!product) {
    return next(
      new ApiError(
        404,
        productMessage.productNotFound.replace(
          '{{productId}}',
          req.params.productId,
        ),
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

exports.hideProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { hide: true },
    { new: true, runValidators: true },
  );

  if (!product) {
    return next(new ApiError(404, 'Product does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.restoreProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { hide: false },
    { new: true, runValidators: true },
  );

  if (!product) {
    return next(new ApiError(404, 'Product does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.productId);

  if (!product) {
    return next(new ApiError(404, 'Product does not exist.'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Delete product Successfully!',
  });
});

exports.getProductStatistics = catchAsync(async (req, res, next) => {
  const totalProducts = await Product.countDocuments();
  // Thống kê số lượng sản phẩm theo từng trạng thái
  const productStatusDistribution = await Product.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Thực hiện grouping theo ngày, tháng và năm
  const productsPerDay = await Product.aggregate([
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
  const formattedProductsPerDay = productsPerDay.map(product => {
    return {
      date: product.date,
      count: product.count,
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalProducts,
      productStatusDistribution,
      productsPerDay: formattedProductsPerDay,
    },
  });
});

