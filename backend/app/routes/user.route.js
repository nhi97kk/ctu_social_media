const express = require('express');
const uploadImage = require('../utils/upload.util');

const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const imageController = require('../controllers/image.controller');

const router = express.Router();

// Authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

// User route
router.route('/').get(userController.getAllUser);
router.route('/search').get(userController.searchUser);
router.route('/all').get(userController.getAll);

router
  .route('/me')
  .get(userController.getMe)
  .patch(userController.updateMe) // This route is not used for update password
  .delete(userController.deleteMe);

// Gửi yêu cầu kết bạn
router.patch('/addFriend/:userId', userController.addFriend);

// Chấp nhận yêu cầu kết bạn
router.patch('/acceptRequest/:userId', userController.acceptRequest);

// Hủy kết bạn
router.patch('/unFriend/:userId', userController.unFriend);

// Tìm tất cả bạn bè và yêu cầu
router.get('/findAllFriends/:userId', userController.findAllFriends);
router.get('/findAllRequests', userController.findAllRequests);

// Lấy danh sách những người khác chưa phải bạn bè hoặc chưa gửi yêu cầu
router.get('/getOthers', userController.getOthers);

router.route('/:userId').get(userController.getUser);

// Image routes
router
  .route('/avatarUpload/:userId')
  .patch(uploadImage.avatarUserUpload, imageController.uploadAvatar);

router
  .route('/coverUpload/:userId')
  .patch(uploadImage.coverUserUpload, imageController.uploadCover);

// Only for admin
router.use(authController.restrictTo('admin'));

router.route('/').post(userController.createUser);

router
  .route('/:userId')
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.get('/admin/user-statistics', userController.getUserStatistics);

module.exports = router;

