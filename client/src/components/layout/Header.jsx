import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../features/auth/AuthContext';

const Header = ({ onOpenAuthModal, onOpenFavorites, onOpenDashboardChoice }) => {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, userProfile, logout, favorites } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
    document.body.style.overflow = isNavActive ? '' : 'hidden'; // Toggle body scroll
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="logo">BookMyHostel</Link>
        <nav className={`main-nav ${isNavActive ? 'active' : ''}`} id="mainNav">
          <NavLink to="/" onClick={toggleNav}>Home</NavLink>
          <NavLink to="/about" onClick={toggleNav}>About</NavLink>
          <NavLink to="/hostels" onClick={toggleNav}>Hostels</NavLink>
          <a href="/#faq" onClick={toggleNav}>FAQs</a> {/* Anchor links still use href */}
          <a href="/#contact" onClick={toggleNav}>Contact</a>
        </nav>
        <div className="actions">
          {isAuthenticated ? (
            <>
              <button className="icon-btn" onClick={onOpenFavorites} aria-label="View your wishlist" style={{ position: 'relative' }}>
                <i className="fa-regular fa-heart"></i>
                {favorites.length > 0 && (
                  <span className="notification-badge" style={{ top: '-5px', right: '-8px', width: '18px', height: '18px', fontSize: '11px' }}>{favorites.length}</span>
                )}
              </button>
              <Link to="/dashboard" className="user-profile" style={{ textDecoration: 'none' }}>
                <img src={userProfile.profilePicture || `https://i.pravatar.cc/30?u=${userProfile.email}`} alt="User profile" />
              </Link>
              <button className="icon-btn" onClick={logout} aria-label="Logout"><i className="fa-solid fa-right-from-bracket"></i></button>
            </>
          ) : (
            <>
              <button className="icon-btn" onClick={onOpenAuthModal} aria-label="Login or Sign up"><i className="fa-solid fa-user"></i></button>
              <button className="icon-btn" onClick={onOpenFavorites} aria-label="View your wishlist" style={{ position: 'relative' }}>
                <i className="fa-regular fa-heart"></i>
                {favorites.length > 0 && (
                  <span className="notification-badge" style={{ top: '-5px', right: '-8px', width: '18px', height: '18px', fontSize: '11px' }}>{favorites.length}</span>
                )}
              </button>
              <button className="icon-btn" onClick={onOpenDashboardChoice} aria-label="Choose your dashboard"><i className="fa-solid fa-table-columns"></i></button>
            </>
          )}
          
          <button className="nav-toggle" onClick={toggleNav}>☰</button>
        </div>
      </div>
      <div className={`mobile-nav-overlay ${isNavActive ? 'active' : ''}`} onClick={toggleNav}></div>
    </header>
  );
};

export default Header;