const express = require('express');

const topicController = require('../controllers/topic.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(topicController.getAllTopic)
  .post(topicController.createTopic);

router.route('/:topicId').get(topicController.getTopic);

// Search Topic by name
router
  .route('/search')
  .get(topicController.searchTopic, topicController.getAllTopic);

// Only for admin
router.use(authController.restrictTo('admin', 'teacher'));

router.route('/').post(topicController.createTopic);

router.patch('/:topicId/softDelete', topicController.hideTopic);

router
  .route('/:topicId')
  .patch(topicController.updateTopic)
  .delete(topicController.deleteTopic);

module.exports = router;
