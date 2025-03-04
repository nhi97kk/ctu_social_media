const express = require('express');

const majorController = require('../controllers/major.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router
  .route('/')
  .get(majorController.getAllMajor)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    majorController.createMajor,
  );

router
  .route('/search')
  .get(majorController.searchMajor, majorController.getAllMajor);

router
  .route('/:majorId')
  .get(majorController.getMajor)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    majorController.updateMajor,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    majorController.deleteMajor,
  );

module.exports = router;
