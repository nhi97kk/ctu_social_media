// app.js

const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const path = require('path');

const ApiError = require('./app/utils/error.util');
const { routeMessage } = require('./app/languages');
const globalErrorHandler = require('./app/controllers/error.controller');

// Routers
const chatbotRouter = require('./app/routes/chatbot.route');
const reportRouter = require('./app/routes/report.route');
const topicRouter = require('./app/routes/topic.route');
const questionRouter = require('./app/routes/question.route');
const answerRouter = require('./app/routes/answer.route');
const groupRouter = require('./app/routes/group.route');
const pageRouter = require('./app/routes/page.route');
const commentRouter = require('./app/routes/comment.route');
const productRouter = require('./app/routes/product.route');
const userRouter = require('./app/routes/user.route');
const majorRouter = require('./app/routes/major.route');
const postRouter = require('./app/routes/post.route');
const chatRouter = require('./app/routes/chat.route');
const messageRouter = require('./app/routes/message.route');

const app = express();
const server = http.createServer(app); // Tạo server HTTP

// Cấu hình middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Use for dev
}
app.set('trust proxy', 1);
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL.split(','),
  }),
);

console.log(`Allow CORS: ${process.env.CLIENT_URL}`);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/chatbot', chatbotRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/topics', topicRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/answers', answerRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/api/v1/pages', pageRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/majors', majorRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/messages', messageRouter);

// Undefined routes
app.use('*', (req, res, next) => {
  return next(
    new ApiError(
      404,
      routeMessage.notFound.replace('{{originalUrl}}', req.originalUrl),
    ),
  );
});

// Handle Errors
app.use(globalErrorHandler);

// Socket.io logic
let activeUsers = [];
const io = new Server(server, {
  cors: {
    origin: '*', // Thay bằng URL chính xác trong môi trường production
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

io.on('connection', socket => {
  // Add new user
  socket.on('new-user-add', newUserId => {
    if (!activeUsers.some(user => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log('Connected Users', activeUsers);
    io.emit('get-users', activeUsers);
  });

  // Send message
  socket.on('send-message', data => {
    console.log(data);
    const { receiverId } = data;
    const user = activeUsers.find(user => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('receive-message', data);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter(user => user.socketId !== socket.id);
    console.log('User Disconnected', activeUsers);
    io.emit('get-users', activeUsers);
  });
});

module.exports = { app, server }; // Xuất cả app và server

