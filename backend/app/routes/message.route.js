const express = require('express');
const authController = require('../controllers/auth.controller');
const messageController = require('../controllers/message.controller');

const router = express.Router();

router.use(authController.protect);

router.route('/').post(messageController.createMessage);

router.route('/:id').get(messageController.getMessage);

router.route('/message/:chatId').get(messageController.getAllMessagesOfChats);

module.exports = router;
