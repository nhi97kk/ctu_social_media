const express = require('express');
const uploadImage = require('../utils/upload.util');

const authController = require('../controllers/auth.controller');
const imageController = require('../controllers/image.controller');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

router.use(authController.protect);

router.route('/').post(chatController.createChat);
router.route('/search').get(chatController.searchChat);

router.route('/groupChat').post(chatController.createGroupChat);

router
  .route('/:id')
  .get(chatController.getChat)
  .patch(chatController.updateGroupChat);

router.route('/chat/:userId').get(chatController.getAllChatsUser);

// Image routes
router
  .route('/avatarUpload/:chatId')
  .patch(
    uploadImage.avatarGroupChatUpload,
    imageController.uploadGroupChatAvatar,
  );

module.exports = router;
