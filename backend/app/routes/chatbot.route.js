const express = require('express');

const upload = require('../utils/upload.util');

const chatbotController = require('../controllers/chatbot.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);

// Route upload file PDF
router
  .route('/')
  .get(chatbotController.getAllPdfs)
  .post(upload.pdfUpload, chatbotController.uploadPdf);

// Update
router.patch('/update/:id', chatbotController.updateContent);

// Route hỏi chatbot
router.post('/ask', chatbotController.handleQuestion);

module.exports = router;
