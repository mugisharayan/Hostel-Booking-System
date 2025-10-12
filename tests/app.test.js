const request = require('supertest');
const express = require('express');

const app = express();

app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, world!' });
});

describe('GET /api/hello', () => {
  it('should return Hello, world!', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Hello, world!');
  });
});
