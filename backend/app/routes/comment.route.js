const express = require('express');
const authController = require('./../controllers/auth.controller');
const commentController = require('../controllers/comment.controller');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(commentController.getAllComments);

router
  .route('/post/:postId')
  .get(commentController.getAllCommentsPost)
  .post(commentController.createComment);

router
  .route('/:commentId')
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

router.patch('/:commentId/like', commentController.likeComment);

router.patch('/:commentId/softDelete', commentController.hideComment);
router.patch('/:commentId/restore', commentController.restoreComment);

module.exports = router;
