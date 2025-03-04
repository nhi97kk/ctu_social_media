const express = require('express');

const uploadImage = require('../utils/upload.util');

const questionController = require('../controllers/question.controller');
const authController = require('../controllers/auth.controller');
const imageController = require('../controllers/image.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(questionController.getAllQuestion)
  .post(questionController.createQuestion);

// Search Question by name
router.route('/search').get(questionController.searchQuestion);

router.route('/topic').get(questionController.getFilterQuestions);

router
  .route('/topic/:topicId')
  .get(questionController.getFilterQuestionsByTopic);
router
  .route('/:questionId')
  .get(questionController.getQuestion)
  .patch(questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

router.patch('/:questionId/like', questionController.likeQuestion);
router.patch('/:questionId/softDelete', questionController.hideQuestion);
router.patch('/:questionId/restore', questionController.restoreQuestion);

// Image routes
router
  .route('/:questionId/images')
  .post(uploadImage.forumMultipleUpload, imageController.createQuestionImage);

router.get(
  '/admin/question-statistics',
  questionController.getQuestionStatistics,
);

module.exports = router;
