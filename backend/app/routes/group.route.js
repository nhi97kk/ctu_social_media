const express = require('express');
const uploadImage = require('../utils/upload.util');

const authController = require('../controllers/auth.controller');
const imageController = require('../controllers/image.controller');
const groupController = require('../controllers/group.controller');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(groupController.getAllGroups)
  .post(groupController.createGroup);

router.route('/search').get(groupController.searchGroup);

router.get('/all/:userId', groupController.getAllUserGroups);
router.get('/suggested', groupController.getSuggestGroups);
router.get('/joined', groupController.getJoinedGroups);

router
  .route('/:groupId')
  .get(groupController.getGroup)
  .patch(groupController.updateGroup)
  .delete(groupController.deleteGroup);

router.patch('/:groupId/softDelete', groupController.hideGroup);
router.patch('/:groupId/restore', groupController.restoreGroup);
router.post('/:groupId/join', groupController.sendJoinRequest); // Gửi yêu cầu tham gia nhóm
router.get('/:groupId/requests', groupController.getGroupJoinRequests); // Lấy danh sách yêu cầu tham gia nhóm
router.get('/:groupId/members', groupController.getGroupMembers); // Lấy danh sách yêu cầu tham gia nhóm
router.patch('/:groupId/accept/:userId', groupController.acceptJoinRequest); // Chấp nhận yêu cầu tham gia nhóm
router.patch('/:groupId/delete/:userId', groupController.deleteMember); // Chấp nhận yêu cầu tham gia nhóm
router.delete('/:groupId/leave', groupController.leaveGroup); // Rời nhóm

router.route('/:groupId/approved').patch(groupController.updateApprovedGroup);
router.route('/:groupId/rejected').patch(groupController.updateRejectedGroup);

// Image routes
router
  .route('/avatarUpload/:groupId')
  .patch(uploadImage.avatarGroupUpload, imageController.uploadGroupAvatar);

router
  .route('/coverUpload/:groupId')
  .patch(uploadImage.coverGroupUpload, imageController.uploadGroupCover);

module.exports = router;
