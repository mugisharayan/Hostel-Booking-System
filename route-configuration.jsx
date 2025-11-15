// Route Configuration - React Router Setup
// File: client/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HostelsPage from './src/features/hostels/HostelsPage';
import HostelDetailPage from './src/features/hostels/HostelDetailPage';

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Hostel Search & Browse Routes */}
        <Route path="/hostels" element={<HostelsPage />} />
        <Route path="/hostel/:hostelId" element={<HostelDetailPage />} />
        
        {/* Booking Routes */}
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Protected Custodian Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Custodian']} />}>
          <Route path="/custodian-dashboard" element={<CustodianDashboardPage />} />
          <Route path="/custodian-room-management" element={<CustodianRoomManagementPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;