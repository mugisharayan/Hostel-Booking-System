const request = require('supertest');
const app = require('../server');

describe('GET /api/test', () => {
  it('should return a greeting message', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Server is running!');
  });
});
