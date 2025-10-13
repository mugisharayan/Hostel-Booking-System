import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <a href="#home">BookMyHostel</a>
        </div>
        <nav className="footer-links">
          <a href="#home">Home</a>
          <a href="#why-us">Why Us</a>
          <a href="#hostels">Hostels</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="Tiktok"><i className="fab fa-tiktok"></i></a>
        </div>
      </div>
      <p className="footer-text">&copy; 2025 BookMyHostel. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
