import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5001/api', // Assuming your backend runs on port 5001
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
});

export const getStudentDashboard = () => API.get('/students/dashboard');

// You can add other API calls here
// export const login = (formData) => API.post('/users/login', formData);
// export const signup = (formData) = > API.post('/users/signup', formData);

export default API;
