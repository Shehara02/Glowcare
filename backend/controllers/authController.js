/* ========================================
   AUTHENTICATION CONTROLLER
   ======================================== */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../middleware/errorHandler');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register User
const register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Validation
    if (!name || !email || !password || !passwordConfirm) {
      return next(new ErrorHandler('Please fill in all fields', 400));
    }

    if (password !== passwordConfirm) {
      return next(new ErrorHandler('Passwords do not match', 400));
    }

    if (password.length < 6) {
      return next(new ErrorHandler('Password must be at least 6 characters', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler('Email already registered', 400));
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

// Login User
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return next(new ErrorHandler('Please provide email and password', 400));
    }

    // Find user and select password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorHandler('Invalid credentials', 401));
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler('Invalid credentials', 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Update User Profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name: name || undefined,
        phone: phone || undefined,
        address: address || undefined
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Change Password
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return next(new ErrorHandler('Please fill in all fields', 400));
    }

    if (newPassword !== confirmPassword) {
      return next(new ErrorHandler('Passwords do not match', 400));
    }

    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    const isPasswordValid = await user.matchPassword(oldPassword);

    if (!isPasswordValid) {
      return next(new ErrorHandler('Old password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  generateToken
};
