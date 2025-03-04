const fs = require('fs').promises;
const path = require('path');

const ApiError = require('../utils/error.util');
const catchAsync = require('../utils/catchAsync.util');

const Chat = require('../models/chat.model');
const Product = require('../models/product.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');
const Post = require('../models/post.model');
const Page = require('../models/page.model');
const Group = require('../models/group.model');
const User = require('../models/user.model');
const { imageMessage } = require('../languages');

async function deleteFileFromUrl(fileUrl) {
  try {
    // Tách đường dẫn để lấy folder và tên file
    const urlParts = new URL(fileUrl);
    const filePath = urlParts.pathname; // Lấy phần đường dẫn từ URL

    // Tách folder và filename từ đường dẫn
    const pathSegments = filePath.split('/');
    const folder = pathSegments[pathSegments.length - 2]; // Lấy folder
    const filename = pathSegments[pathSegments.length - 1]; // Lấy tên file

    // Kiểm tra nếu tên file là "avatar-default" hoặc "cover-default" thì không thực hiện xóa
    if (
      filename === 'default-avatar.jpg' ||
      filename === 'default-cover-image.jpg'
    ) {
      console.log(`Không thực hiện xóa vì file là ${filename}`);
      return;
    }

    // Xóa file ảnh
    await fs.rm(path.join(__dirname, `../../uploads/${folder}/${filename}`));

    console.log(`File ${filename} đã được xóa thành công.`);
  } catch (error) {
    console.error('Lỗi khi xóa file:', error);
  }
}

exports.createProductImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return next(new ApiError(404, 'Cannot find product with this ID!'));
    }

    const images = await Promise.all(
      req.files.map(async file => {
        return {
          name: process.env.PRODUCT_IMAGE_PATH + file.filename,
        };
      }),
    );

    product.images.push(...images.map(image => image.name));
    await product.save();

    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProductImage = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ApiError(404, 'Product does not exist.'));
  }

  const images = product.images || [];
  for (const imageUrl of images) {
    await deleteFileFromUrl(imageUrl);
  }

  next();
});

exports.createPostImage = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return next(
        new ApiError(404, 'Không tìm thấy bài viết với ID tương ứng!'),
      );
    }

    const images = await Promise.all(
      req.files.map(async file => {
        return {
          name: process.env.POST_IMAGE_PATH + file.filename,
        };
      }),
    );

    post.images.push(...images.map(image => image.name));
    await post.save();

    res.status(201).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePostImage = catchAsync(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return next(
        new ApiError(404, 'Không tìm thấy bài viết với ID tương ứng!'),
      );
    }

    post.images = null;
    await post.save();
    await fs.rm(req.file.path);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
});

exports.uploadAvatar = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);

    if (!user) {
      return next(
        new ApiError(
          404,
          imageMessage.userNotFound.replace('{{userId}}', req.params.userId),
        ),
      );
    }

    await deleteFileFromUrl(user.avatar);

    user = await User.findOneAndUpdate(
      { _id: req.params.userId }, // Điều kiện tìm kiếm
      { avatar: `${process.env.AVATAR_IMAGE_PATH}${req.file.filename}` }, // Dữ liệu cần cập nhật
      { new: true, runValidators: true }, // Các tùy chọn
    ).select('+active'); // Tùy chọn select thêm, nếu cần thiết

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadCover = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);

    if (!user) {
      return next(
        new ApiError(
          404,
          imageMessage.userNotFound.replace('{{userId}}', req.params.userId),
        ),
      );
    }

    await deleteFileFromUrl(user.coverImage);

    user = await User.findOneAndUpdate(
      { _id: req.params.userId }, // Điều kiện tìm kiếm
      { coverImage: `${process.env.COVER_IMAGE_PATH}${req.file.filename}` }, // Dữ liệu cần cập nhật
      { new: true, runValidators: true }, // Các tùy chọn
    ).select('+active'); // Tùy chọn select thêm, nếu cần thiết

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// page
exports.uploadPageAvatar = async (req, res, next) => {
  try {
    let page = await Page.findById(req.params.pageId);

    if (!page) {
      return next(new ApiError(404, 'Cannot find page with this ID!'));
    }

    await deleteFileFromUrl(page.avatar);

    page = await Page.findOneAndUpdate(
      { _id: req.params.pageId }, // Điều kiện tìm kiếm
      { avatar: `${process.env.AVATAR_IMAGE_PATH}${req.file.filename}` }, // Dữ liệu cần cập nhật
      { new: true, runValidators: true }, // Các tùy chọn
    ); // Tùy chọn select thêm, nếu cần thiết

    res.status(201).json({
      status: 'success',
      data: {
        page,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadPageCover = async (req, res, next) => {
  try {
    let page = await Page.findById(req.params.pageId);

    if (!page) {
      return next(new ApiError(404, 'Cannot find page with this ID!'));
    }

    await deleteFileFromUrl(page.coverImage);

    page = await Page.findOneAndUpdate(
      { _id: req.params.pageId }, // Điều kiện tìm kiếm
      { coverImage: `${process.env.COVER_IMAGE_PATH}${req.file.filename}` }, // Dữ liệu cần cập nhật
      { new: true, runValidators: true }, // Các tùy chọn
    ); // Tùy chọn select thêm, nếu cần thiết

    res.status(201).json({
      status: 'success',
      data: {
        page,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePageImage = catchAsync(async (req, res, next) => {
  const page = await Page.findById(req.params.pageId);

  if (!page) {
    return next(new ApiError(404, 'Page does not exist.'));
  }

  await deleteFileFromUrl(page.avatar);
  await deleteFileFromUrl(page.coverImage);

  next();
});

exports.uploadGroupAvatar = async (req, res, next) => {
  try {
    let group = await Group.findById(req.params.groupId);

    if (!group) {
      return next(new ApiError(404, 'Cannot find group with this ID!'));
    }

    await deleteFileFromUrl(group.avatar);

    group = await Group.findOneAndUpdate(
      { _id: req.params.groupId }, // Điều kiện tìm kiếm
      { avatar: `${process.env.AVATAR_IMAGE_PATH}${req.file.filename}` }, // Dữ liệu cần cập nhật
      { new: true, runValidators: true }, // Các tùy chọn
    ); // Tùy chọn select thêm, nếu cần thiết

    res.status(201).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadGroupCover = async (req, res, next) => {
  try {
    let group = await Group.findById(req.params.groupId);

    if (!group) {
      return next(new ApiError(404, 'Cannot find group with this ID!'));
    }

    await deleteFileFromUrl(group.coverImage);

    group = await Group.findOneAndUpdate(
      { _id: req.params.groupId }, // Điều kiện tìm kiếm
      { coverImage: `${process.env.COVER_IMAGE_PATH}${req.file.filename}` }, // Dữ liệu cần cập nhật
      { new: true, runValidators: true }, // Các tùy chọn
    ); // Tùy chọn select thêm, nếu cần thiết

    res.status(201).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createQuestionImage = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);

    if (!question) {
      return next(new ApiError(404, 'Cannot find question with this ID!'));
    }

    const images = await Promise.all(
      req.files.map(async file => {
        return {
          name: process.env.FORUM_IMAGE_PATH + file.filename,
        };
      }),
    );

    question.images.push(...images.map(image => image.name));
    await question.save();

    res.status(201).json({
      status: 'success',
      data: {
        question,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createAnswerImage = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return next(new ApiError(404, 'Cannot find answer with this ID!'));
    }

    const images = await Promise.all(
      req.files.map(async file => {
        return {
          name: process.env.FORUM_IMAGE_PATH + file.filename,
        };
      }),
    );

    answer.images.push(...images.map(image => image.name));
    await answer.save();

    res.status(201).json({
      status: 'success',
      data: {
        answer,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadGroupChatAvatar = async (req, res, next) => {
  try {
    let chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return next(new ApiError(404, 'Group chat does not exits.'));
    }

    if (chat.avatar != '') {
      await deleteFileFromUrl(chat.avatar);
    }

    chat = await Chat.findOneAndUpdate(
      { _id: req.params.chatId }, // Điều kiện tìm kiếm
      { avatar: `${process.env.AVATAR_IMAGE_PATH}${req.file.filename}` }, // Dữ liệu cần cập nhật
      { new: true, runValidators: true }, // Các tùy chọn
    ); // Tùy chọn select thêm, nếu cần thiết

    res.status(201).json({
      status: 'success',
      data: {
        chat,
      },
    });
  } catch (err) {
    next(err);
  }
};

