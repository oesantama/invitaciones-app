import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import User from '../models/User.model';

describe('Auth API', () => {

  beforeAll(async () => {
    // Connect to a test database
    const MONGODB_URI_TEST = 'mongodb://localhost:27017/invitaciones_test';
    await mongoose.connect(MONGODB_URI_TEST);
  }, 30000);

  afterAll(async () => {
    // Cleanup and disconnect
    await User.deleteMany({});
    await mongoose.connection.close();
  }, 30000);

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('should not register a user with an existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error.message).toBe('Email already registered');
    });
  });
});
