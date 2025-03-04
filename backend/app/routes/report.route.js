const express = require('express');

const reportController = require('../controllers/report.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(reportController.getAllReport)
  .post(reportController.createReport);

// Only for admin
router.use(authController.restrictTo('admin'));

router.get('/admin/report-statistics', reportController.getReportStatistics);

router.route('/:reportId/report/resolve').patch(reportController.resolveReport);
router.route('/:reportId/report/reject').patch(reportController.rejectReport);

router.patch('/:reportId/softDelete', reportController.hideReport);
router.patch('/:reportId/restore', reportController.restoreReport);

router
  .route('/:targetId/:targetModel/resolve')
  .patch(reportController.resolveReports);
router
  .route('/:targetId/:targetModel/reject')
  .patch(reportController.rejectReports);

router.route('/:reportId').delete(reportController.deleteReport);

module.exports = router;
