// Simple test server
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

app.post('/api/users/register', (req, res) => {
  console.log('Registration request received:', req.body);
  res.json({ 
    message: 'Test registration endpoint',
    data: req.body 
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});