const express = require('express');
const uploadImage = require('../utils/upload.util');

const authController = require('../controllers/auth.controller');
const imageController = require('../controllers/image.controller');
const pageController = require('../controllers/page.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(pageController.getAllPages)
  .post(pageController.createPage);

router.route('/search').get(pageController.searchPage);

router.get('/all/:userId', pageController.getAllUserPages);
router.get('/suggested', pageController.getSuggestPages);
router.get('/followed', pageController.getFollowedPages);

router
  .route('/:pageId')
  .get(pageController.getPage)
  .patch(pageController.updatePage)
  .delete(imageController.deletePageImage, pageController.deletePage);

router.post('/:pageId/follow', pageController.followPage);
router.patch('/:pageId/softDelete', pageController.hidePage);
router.patch('/:pageId/restore', pageController.restorePage);

router.route('/:pageId/approved').patch(pageController.updateApprovedPage);
router.route('/:pageId/rejected').patch(pageController.updateRejectedPage);

// Image routes
router
  .route('/avatarUpload/:pageId')
  .patch(uploadImage.avatarPageUpload, imageController.uploadPageAvatar);

router
  .route('/coverUpload/:pageId')
  .patch(uploadImage.coverPageUpload, imageController.uploadPageCover);

module.exports = router;
