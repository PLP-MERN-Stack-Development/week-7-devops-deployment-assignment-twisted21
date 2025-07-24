const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Task API', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Create test user
    testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks for authenticated user', async () => {
      // Create test tasks
      const tasks = [
        { title: 'Task 1', description: 'Description 1', userId: testUser._id },
        { title: 'Task 2', description: 'Description 2', userId: testUser._id }
      ];
      await Task.insertMany(tasks);

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Task 1');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: 'pending',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Task');
      expect(response.body.userId).toBe(testUser._id.toString());
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'No title' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const task = await Task.create({
        title: 'Original Title',
        userId: testUser._id
      });

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        userId: testUser._id
      });

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });
  });

  describe('GET /api/tasks/stats/summary', () => {
    it('should return task statistics', async () => {
      // Create tasks with different statuses
      await Task.insertMany([
        { title: 'Task 1', status: 'pending', userId: testUser._id },
        { title: 'Task 2', status: 'in-progress', userId: testUser._id },
        { title: 'Task 3', status: 'completed', userId: testUser._id },
        { title: 'Task 4', status: 'pending', priority: 'high', userId: testUser._id }
      ]);

      const response = await request(app)
        .get('/api/tasks/stats/summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(4);
      expect(response.body.pending).toBe(2);
      expect(response.body.inProgress).toBe(1);
      expect(response.body.completed).toBe(1);
      expect(response.body.highPriority).toBe(1);
    });
  });
}); 