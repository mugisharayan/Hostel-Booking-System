import axios from 'axios';

// You can set a base URL for all API requests
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// We can add an interceptor to include the auth token in every request
API.interceptors.request.use((req) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Student Service ---
export const getStudentDashboard = () => API.get('/students/dashboard');

// You can add other service calls here, e.g., for payments, maintenance, etc.