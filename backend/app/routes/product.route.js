const express = require('express');

const uploadImage = require('../utils/upload.util');

const productController = require('../controllers/product.controller');
const authController = require('../controllers/auth.controller');
const imageController = require('../controllers/image.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(productController.getAllProduct)
  .post(productController.createProduct);

router.route('/filter').get(productController.getFilterProduct);
router.route('/all/filter').get(productController.getAllFilterProduct);

router
  .route('/:productId')
  .get(productController.getProduct)
  .patch(productController.updateSoldProduct);

// Image routes

router
  .route('/:productId/images')
  .post(uploadImage.multipleUpload, imageController.createProductImage);

// Only for admin
router.use(authController.restrictTo('admin'));

router.get('/admin/product-statistics', productController.getProductStatistics);

router
  .route('/:productId/approved')
  .patch(productController.updateApprovedProduct);
router
  .route('/:productId/rejected')
  .patch(productController.updateRejectedProduct);

router.patch('/:productId/softDelete', productController.hideProduct);
router.patch('/:productId/restore', productController.restoreProduct);

router
  .route('/:productId')
  .delete(imageController.deleteProductImage, productController.deleteProduct);

module.exports = router;

