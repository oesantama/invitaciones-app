import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Authentication token is required',
          status: 401
        }
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: {
          message: 'User not found or inactive',
          status: 401
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          message: 'Invalid token',
          status: 401
        }
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          message: 'Token has expired',
          status: 401
        }
      });
    }

    return res.status(500).json({
      error: {
        message: 'Server error during authentication',
        status: 500
      }
    });
  }
};

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
