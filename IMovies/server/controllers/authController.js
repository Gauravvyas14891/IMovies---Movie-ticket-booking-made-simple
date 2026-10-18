const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const { generateToken } = require('../utils/tokenHelper');

// Register User
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'User with this email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'USER',
    });

    const token = generateToken({ user: { id: user._id, email: user.email, username: user.username, role: 'USER' } });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, username: user.username, email: user.email, role: 'USER' },
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken({ user: { id: user._id, email: user.email, username: user.username, role: user.role } });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// Register Admin (Dedicated admin registration endpoint)
exports.registerAdmin = async (req, res, next) => {
  try {
    const { username, email, password, adminSecret } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    // Optional admin secret verification to prevent unauthorized admin creation
    if (process.env.ADMIN_REGISTRATION_SECRET && adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(403).json({ success: false, error: 'Invalid admin registration key.' });
    }

    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(409).json({ success: false, error: 'Admin with this email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role: 'ADMIN',
    });

    const token = generateToken({ user: { id: admin._id, email: admin.email, username: admin.username, role: 'ADMIN' } });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      user: { id: admin._id, username: admin.username, email: admin.email, role: 'ADMIN' },
    });
  } catch (error) {
    next(error);
  }
};

// Login Admin
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, error: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid admin credentials.' });
    }

    const token = generateToken({ user: { id: admin._id, email: admin.email, username: admin.username, role: 'ADMIN' } });

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: { id: admin._id, username: admin.username, email: admin.email, role: 'ADMIN' },
    });
  } catch (error) {
    next(error);
  }
};

// Get current authenticated user
exports.getMe = async (req, res, next) => {
  try {
    if (req.user.role === 'ADMIN') {
      const admin = await Admin.findById(req.user.id).select('-password');
      return res.status(200).json({ success: true, user: admin });
    }

    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
