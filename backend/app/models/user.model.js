const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { createToken } = require('../utils/token.util');
const { userMessage } = require('../languages');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, userMessage.requiredEmail],
      unique: [true, 'The email already exists.'], // FIXME: unique email
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: userMessage.invalidEmail,
      },
    },
    password: {
      type: String,
      required: [true, userMessage.requiredPassword],
      minlength: [8, userMessage.minlengthPassword],
      maxlength: [16, 'Password cannot be more than 16 characters long!'],
      // validate: {
      //   validator: validator.isStrongPassword,
      //   message:
      //     'Password must be at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol!',
      // },
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, userMessage.requiredConfirmPassword],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: userMessage.invalidConfirmPassword,
      },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    role: {
      type: String,
      enum: ['admin', 'teacher', 'user'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    avatar: {
      type: String,
      default: process.env.DEFAULT_PATH_AVATAR,
    },
    coverImage: {
      type: String,
      default: process.env.DEFAULT_PATH_COVER,
    },
    major: {
      type: mongoose.Schema.ObjectId,
      ref: 'Major',
    },
    requests: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    friends: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    // Addition Field for auth (user cannot access)
    passwordChangedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  },
);

// Compare login password
userSchema.methods.comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

// Check token is valid
userSchema.methods.passwordChangedAfter = function (timestamp) {
  return this.passwordChangedAt / 1000 > timestamp;
};

// Hash password and set passwordChangedAt (if create new or update password)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // If user has already created or has changed password
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  this.passwordChangedAt = Date.now();
  next();
});

// Only allow user active login
userSchema.pre(/^find/, function () {
  this.populate({
    path: 'major',
  });
  // For order route (trick -> FIXME: find another way)
  if (this._fields && this._fields.active === 1 && this._fields.order === 1)
    return;
  // If using for activating user, find all
  if (!this._conditions.userActiveToken && !this._conditions.isAdminAccess)
    this.find({ active: true });
  // For admin access
  if (this._conditions.isAdminAccess) {
    this._conditions.isAdminAccess = undefined;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

