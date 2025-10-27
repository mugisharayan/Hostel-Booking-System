import React from 'react';

// --- Auth ---
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

// --- Layout Components ---
import Header from './components/Header';
import Footer from './components/Footer';

// --- Page Components ---
import StudentDashboard from './components/StudentDashboard';
import LoginPage from './components/Login';
import Signup from './components/Signup';
import PaymentPage from './components/paymentPage';
import HostelDetails from './components/HostelDetails';

// --- Homepage Section Components ---
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import PopularHostels from './components/PopularHostels';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import { Routes, Route } from 'react-router-dom';
import './styles.css';

// This component will represent your main landing page.
const MainPage = () => (
  <>
    <Hero />
    <WhyUs />
    <PopularHostels />
    <Testimonials />
    <Contact />
  </>
);

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/hostel/:id" element={<HostelDetails />} />

            {/* --- Protected Student Routes --- */}
            <Route path="/dashboard" element={
                <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
            }/>
            <Route path="/payment/:bookingId" element={
                <ProtectedRoute role="student"><PaymentPage /></ProtectedRoute>
            }/>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
