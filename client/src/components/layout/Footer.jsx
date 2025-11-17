import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../features/auth/AuthContext';

const Footer = () => {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        <div className="animate-on-scroll">
          <Link to="/" className="logo footer-logo">
            <i className="fa-solid fa-home"></i>
            Book<span className="logo-highlight">My</span>Hostel
          </Link>
          <p>Your trusted partner for finding student accommodation at Makerere University.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
        <div className="animate-on-scroll" style={{ transitionDelay: '100ms' }}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/hostels">All Hostels</Link></li>
            <li><a href="/#faq">FAQs</a></li>
          </ul>
        </div>
        <div className="animate-on-scroll" style={{ transitionDelay: '200ms' }}>
          <h4>Hostel Areas</h4>
          <ul>
            <li><Link to="/hostels?location=kikoni">Kikoni</Link></li>
            <li><Link to="/hostels?location=wandegeya">Wandegeya</Link></li>
            <li><Link to="/hostels?location=kikumi-kikumi">Kikumi Kikumi</Link></li>
          </ul>
        </div>
        <div className="animate-on-scroll" style={{ transitionDelay: '300ms' }}>
          <h4>Legal</h4>
          <ul>
            <li><Link to="#">Privacy Policy</Link></li>
            <li><Link to="#">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="copyright">© BookMyHostel. All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;