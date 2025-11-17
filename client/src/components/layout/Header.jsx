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
        <Link to="/" className="logo">
          <i className="fa-solid fa-home"></i>
          Book<span className="logo-highlight">My</span>Hostel
        </Link>
        <nav className={`main-nav ${isNavActive ? 'active' : ''}`} id="mainNav">
          <NavLink to="/" onClick={toggleNav}>Home</NavLink>
          <NavLink to="/about" onClick={toggleNav}>About</NavLink>
          <NavLink to="/hostels" onClick={toggleNav}>Hostels</NavLink>
          <NavLink to="/faq" onClick={toggleNav}>FAQs</NavLink>
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
              <Link to={userProfile?.role === 'Custodian' ? '/custodian-dashboard' : '/dashboard'} className="user-profile" style={{ textDecoration: 'none' }}>
                <img 
                  src={userProfile.profilePicture || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='15' fill='%23f0f0f0'/%3E%3Cpath d='M15 9c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 18c-5 0-9-2-9-5 0-3 4-5 9-5s9 2 9 5c0 3-4 5-9 5z' fill='%23ccc'/%3E%3C/svg%3E"} 
                  alt="User profile" 
                  style={{border: '1px solid #00bfff', borderRadius: '50%'}}
                />
              </Link>
              <button className="icon-btn" onClick={logout} aria-label="Logout"><i className="fa-solid fa-right-from-bracket"></i></button>
            </>
          ) : (
            <>
              <button className="icon-btn" onClick={() => onOpenAuthModal('hostels')} aria-label="Login or Sign up"><i className="fa-solid fa-user"></i></button>
              <button className="icon-btn" onClick={onOpenFavorites} aria-label="View your wishlist" style={{ position: 'relative' }}>
                <i className="fa-regular fa-heart"></i>
                {favorites.length > 0 && (
                  <span className="notification-badge" style={{ top: '-5px', right: '-8px', width: '18px', height: '18px', fontSize: '11px' }}>{favorites.length}</span>
                )}
              </button>
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