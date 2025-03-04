const mongoose = require('mongoose');

// const { cartMessage } = require('../languages/index.js');

const majorSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Phai nhap ten nganh'],
  },
  college: {
    type: String,
    required: [true, 'Phai nhap don vi'],
  },
});

const Major = mongoose.model('Major', majorSchema);

module.exports = Major;
