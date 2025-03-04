// server.js

const mongoose = require('mongoose');
require('dotenv').config({ path: 'config.env' });
const { app, server } = require('./app');

async function startServer() {
  try {
    const { PORT, MONGODB_URI, NODE_ENV } = process.env;

    console.log(`Environment: ${NODE_ENV}`);

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log(`Connect to DB successfully!`);

    // Listen on server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log('There is some internal error!', err);
    process.exit(1);
  }
}

startServer();

