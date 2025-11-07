import express from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { register, login, getMe, updateProfile } from '../controllers/auth.controller.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Register new user
router.post('/register', registerValidation, register);

// Login
router.post('/login', loginValidation, login);

// Get current user
router.get('/me', authMiddleware, getMe);

// Update profile
router.put('/profile', authMiddleware, updateProfile);

export default router;
