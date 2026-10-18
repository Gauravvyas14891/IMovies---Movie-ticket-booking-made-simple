const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Admin username is required'],
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      maxlength: [50, 'Email cannot exceed 50 characters'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      default: 'ADMIN',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
