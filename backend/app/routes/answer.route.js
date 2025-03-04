const express = require('express');

const uploadImage = require('../utils/upload.util');

const answerController = require('../controllers/answer.controller');
const authController = require('../controllers/auth.controller');
const imageController = require('../controllers/image.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(answerController.getAllAnswer)
  .post(answerController.createAnswer);

// Search Answer by name
router
  .route('/search')
  .get(answerController.searchAnswer, answerController.getAllAnswer);

router.route('/solutions/:questionId').get(answerController.getSolutions);

router
  .route('/question/:questionId')
  .get(answerController.getAllAnswerByQuestion);

router.route('/accept/:answerId').patch(answerController.acceptAsSolution);

router
  .route('/:answerId')
  .get(answerController.getAnswer)
  .patch(answerController.updateAnswer);

router.route('/:answerId/like').patch(answerController.likeAnswer);

// Image routes

router
  .route('/:answerId/images')
  .post(uploadImage.forumMultipleUpload, imageController.createAnswerImage);

router.patch('/:answerId/softDelete', answerController.hideAnswer);
router.patch('/:answerId/restore', answerController.restoreAnswer);

module.exports = router;
