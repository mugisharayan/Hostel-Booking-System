# Frontend-Backend Integration Setup

## Quick Start

### 1. Install Dependencies
```bash
# Install both frontend and backend dependencies
npm install
```

### 2. Start Development Servers

#### Option A: Start Both (Recommended)
```bash
npm run dev:full
```
This starts both frontend (port 5173) and backend (port 5000) simultaneously.

#### Option B: Start Separately
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Integration Features

### ✅ Completed
- Centralized API service (`client/src/service/api.service.js`)
- CSRF protection with secure token generation
- Updated AuthModal to use backend API
- Error handling and response interceptors
- Concurrent development setup

### 🔧 API Endpoints Available
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/hostels` - Get all hostels
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `POST /api/payments` - Process payment
- `GET /api/maintenance` - Get maintenance requests

### 🎯 Next Steps
1. Test user registration and login
2. Update other components to use `apiService`
3. Replace localStorage data with API calls
4. Implement proper error handling UI
5. Add loading states to components

## Usage Examples

### Using API Service in Components
```javascript
import apiService from '../service/api.service';

// Login
const response = await apiService.auth.login(email, password);

// Get hostels
const hostels = await apiService.hostels.getAll();

// Create booking
const booking = await apiService.bookings.create(bookingData);
```

### Error Handling
```javascript
try {
  const response = await apiService.auth.login(email, password);
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else {
    // Handle other errors
  }
}
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (.env) - Optional
```
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Common Issues
1. **CORS errors**: Backend is configured for localhost:5173
2. **MongoDB connection**: Check your MONGO_URI in server/.env
3. **Port conflicts**: Backend uses 5000, frontend uses 5173

### Debug Tips
- Check browser Network tab for API calls
- Check server console for backend errors
- Verify MongoDB connection in server logs