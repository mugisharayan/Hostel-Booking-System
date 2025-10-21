import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HostelDetails from './components/HostelDetails';
import PaymentPage from './components/PaymentPage'; // Corrected import path
import Header from './components/Header';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import PopularHostels from './components/PopularHostels';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
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
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
