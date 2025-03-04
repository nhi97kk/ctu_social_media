const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check the fieldname to store in appropriate folder
    let folder = '';

    switch (file.fieldname) {
      case 'avatar-user':
      case 'avatar-page':
      case 'avatar-group':
      case 'avatar-group-chat':
        folder = 'avatars';
        break;
      case 'cover-user':
      case 'cover-page':
      case 'cover-group':
        folder = 'covers';
        break;
      case 'post':
        folder = 'posts';
        break;
      case 'forum':
        folder = 'forums';
        break;
      case 'images':
        folder = 'products';
        break;
      case 'pdf': // Fieldname for PDF files
        folder = 'chatbot';
        break;
      default:
        folder = 'others'; // fallback folder
    }

    // Full path to the folder
    cb(null, path.join(__dirname, `../../uploads/${folder}`));
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const ext = path.extname(file.originalname); // Get file extension
    cb(
      null,
      `${file.fieldname}-${Date.now()}-${Math.floor(
        Math.random() * 100000,
      )}${ext}`,
    );
  },
});

// Initialize multer with the storage engine
const upload = multer({
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB (có thể tăng thêm nếu cần)
  storage,
});

// Middleware for single and multiple file uploads
exports.multipleUpload = upload.array('images', 10); // Multiple file uploads
exports.forumMultipleUpload = upload.array('forum', 5); // forum upload multi images
exports.postMultipleUpload = upload.array('post', 5); // Post upload multi images

exports.avatarUserUpload = upload.single('avatar-user'); // Avatar upload
exports.avatarPageUpload = upload.single('avatar-page');
exports.avatarGroupUpload = upload.single('avatar-group');
exports.avatarGroupChatUpload = upload.single('avatar-group-chat');

exports.coverUserUpload = upload.single('cover-user'); // Cover upload
exports.coverPageUpload = upload.single('cover-page');
exports.coverGroupUpload = upload.single('cover-group');

exports.pdfUpload = upload.single('pdf'); // PDF upload for chatbot

