import React from 'react';
import { Link } from 'react-router-dom';

// Constants
const BRAND_NAME = 'BookMyHostel';
const BRAND_DESCRIPTION = 'Your trusted partner for finding student accommodation at Makerere University.';
const CURRENT_YEAR = new Date().getFullYear();

// Footer data
const SOCIAL_LINKS = [
  { href: '#', icon: 'fab fa-facebook-f', label: 'Facebook' },
  { href: '#', icon: 'fab fa-twitter', label: 'Twitter' },
  { href: '#', icon: 'fab fa-instagram', label: 'Instagram' },
  { href: '#', icon: 'fab fa-whatsapp', label: 'WhatsApp' }
];

const QUICK_LINKS = [
  { to: '/', label: 'Home', type: 'route' },
  { to: '/about', label: 'About Us', type: 'route' },
  { to: '/hostels', label: 'All Hostels', type: 'route' },
  { to: '/#faq', label: 'FAQs', type: 'anchor' }
];

const HOSTEL_AREAS = [
  { to: '/hostels?location=kikoni', label: 'Kikoni' },
  { to: '/hostels?location=wandegeya', label: 'Wandegeya' },
  { to: '/hostels?location=kikumi-kikumi', label: 'Kikumi Kikumi' }
];

const LEGAL_LINKS = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-of-service', label: 'Terms of Service' }
];

// Helper functions
const renderSocialLinks = () => {
  return SOCIAL_LINKS.map((social, index) => (
    <a 
      key={index}
      href={social.href} 
      aria-label={social.label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className={social.icon}></i>
    </a>
  ));
};

const renderLinkList = (links) => {
  return links.map((link, index) => (
    <li key={index}>
      {link.type === 'anchor' ? (
        <a href={link.to}>{link.label}</a>
      ) : (
        <Link to={link.to}>{link.label}</Link>
      )}
    </li>
  ));
};

const Footer = () => {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        {/* Brand Section */}
        <div className="animate-on-scroll footer-brand">
          <Link to="/" className="logo footer-logo">
            {BRAND_NAME}
          </Link>
          <p className="brand-description">
            {BRAND_DESCRIPTION}
          </p>
          <div className="social-links">
            {renderSocialLinks()}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="animate-on-scroll footer-section" style={{ transitionDelay: '100ms' }}>
          <h4>Quick Links</h4>
          <ul>
            {renderLinkList(QUICK_LINKS)}
          </ul>
        </div>

        {/* Hostel Areas Section */}
        <div className="animate-on-scroll footer-section" style={{ transitionDelay: '200ms' }}>
          <h4>Hostel Areas</h4>
          <ul>
            {renderLinkList(HOSTEL_AREAS)}
          </ul>
        </div>

        {/* Legal Section */}
        <div className="animate-on-scroll footer-section" style={{ transitionDelay: '300ms' }}>
          <h4>Legal</h4>
          <ul>
            {renderLinkList(LEGAL_LINKS)}
          </ul>
        </div>
      </div>
      
      <div className="copyright">
        © {CURRENT_YEAR} {BRAND_NAME}. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;