import User from '../models/User.model.js';
import { generateToken } from '../middleware/auth.middleware.js';
import { validationResult } from 'express-validator';

// Register new user
export const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, name, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: {
          message: 'Email already registered',
          status: 400
        }
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      phone
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error registering user',
        status: 500
      }
    });
  }
};

// Login
export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          status: 401
        }
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          status: 401
        }
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error logging in',
        status: 500
      }
    });
  }
};

// Get current user
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error fetching user',
        status: 500
      }
    });
  }
};

// Update profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const allowedUpdates = { name, phone, avatar };

    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(key =>
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Error updating profile',
        status: 500
      }
    });
  }
};
