import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HostelDetails from './components/HostelDetails';
import StudentPayment from './components/StudentPayment';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import PopularHostels from './components/PopularHostels';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Booking from './components/Booking';
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
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* The root path now renders all your main page components */}
          <Route path="/" element={<MainPage />} />
          <Route path="/hostel/:id" element={<HostelDetails />} />
          <Route path="/payment" element={<StudentPayment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
