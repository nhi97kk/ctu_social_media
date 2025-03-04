const express = require('express');
const uploadImage = require('../utils/upload.util');

const authController = require('../controllers/auth.controller');
const imageController = require('../controllers/image.controller');
const postController = require('../controllers/post.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(postController.getAllPost)
  .post(postController.createPost);

// Search post by desc
router.route('/search').get(postController.searchPost);

router.get('/all/:userId', postController.getAllUserPosts);
router.get('/page/:pageId', postController.getAllPagePosts);
router.get('/pages', postController.getAllPagesPosts);
router.get('/group/:groupId', postController.getAllGroupPosts);
router.get('/groups', postController.getAllGroupsPosts);

router.route('/newsfeed').get(postController.getNewsFeed);

router
  .route('/:postId')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

router.patch('/:postId/like', postController.likePost);

router.post('/:postId/share', postController.sharePost);

router.patch('/:postId/softDelete', postController.hidePost);
router.patch('/:postId/restore', postController.restorePost);

// Image routes
router
  .route('/:postId/postUpload')
  .post(uploadImage.postMultipleUpload, imageController.createPostImage);

// Only for admin
router.use(authController.restrictTo('admin'));

router.get('/admin/post-statistics', postController.getPostStatistics);

router.route('/:postId/postDelete').delete(imageController.deletePostImage);

module.exports = router;
