

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Example route
app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, world!' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

module.exports = app;

