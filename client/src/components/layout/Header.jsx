import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../../features/auth/AuthContext';
import { buildClassName } from '../../utils/component.utils';

// Constants
const SCROLL_THRESHOLD = 50;
const BRAND_NAME = 'BookMyHostel';

// Navigation items
const NAV_ITEMS = [
  { to: '/', label: 'Home', type: 'route' },
  { to: '/about', label: 'About', type: 'route' },
  { to: '/hostels', label: 'Hostels', type: 'route' },
  { to: '/#faq', label: 'FAQs', type: 'anchor' },
  { to: '/#contact', label: 'Contact', type: 'anchor' }
];

// Helper functions
const getProfileImageUrl = (userProfile) => {
  return userProfile?.profilePicture || `https://i.pravatar.cc/30?u=${userProfile?.email}`;
};

const toggleBodyScroll = (disable) => {
  document.body.style.overflow = disable ? 'hidden' : '';
};

const Header = ({ onOpenAuthModal, onOpenFavorites, onOpenDashboardChoice }) => {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, userProfile, logout, favorites } = useContext(AuthContext);

  // Scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Navigation toggle
  const toggleNav = useCallback(() => {
    const newNavState = !isNavActive;
    setIsNavActive(newNavState);
    toggleBodyScroll(newNavState);
  }, [isNavActive]);

  // Close navigation
  const closeNav = useCallback(() => {
    setIsNavActive(false);
    toggleBodyScroll(false);
  }, []);

  // Render navigation items
  const renderNavItems = () => {
    return NAV_ITEMS.map((item) => {
      if (item.type === 'route') {
        return (
          <NavLink key={item.to} to={item.to} onClick={closeNav}>
            {item.label}
          </NavLink>
        );
      }
      return (
        <a key={item.to} href={item.to} onClick={closeNav}>
          {item.label}
        </a>
      );
    });
  };

  // Render favorites button
  const renderFavoritesButton = () => (
    <button 
      className="icon-btn favorites-btn" 
      onClick={onOpenFavorites} 
      aria-label="View your wishlist"
    >
      <i className="fa-regular fa-heart"></i>
      {favorites.length > 0 && (
        <span className="notification-badge">
          {favorites.length}
        </span>
      )}
    </button>
  );

  // Render authenticated user actions
  const renderAuthenticatedActions = () => (
    <>
      {renderFavoritesButton()}
      <Link to="/dashboard" className="user-profile">
        <img 
          src={getProfileImageUrl(userProfile)} 
          alt={`${userProfile?.name || 'User'} profile`} 
        />
      </Link>
      <button 
        className="icon-btn logout-btn" 
        onClick={logout} 
        aria-label="Logout"
      >
        <i className="fa-solid fa-right-from-bracket"></i>
      </button>
    </>
  );

  // Render guest user actions
  const renderGuestActions = () => (
    <>
      <button 
        className="icon-btn auth-btn" 
        onClick={onOpenAuthModal} 
        aria-label="Login or Sign up"
      >
        <i className="fa-solid fa-user"></i>
      </button>
      {renderFavoritesButton()}
      <button 
        className="icon-btn dashboard-btn" 
        onClick={onOpenDashboardChoice} 
        aria-label="Choose your dashboard"
      >
        <i className="fa-solid fa-table-columns"></i>
      </button>
    </>
  );

  // Build class names
  const headerClassName = buildClassName('site-header', [
    isScrolled && 'scrolled'
  ]);

  const navClassName = buildClassName('main-nav', [
    isNavActive && 'active'
  ]);

  const overlayClassName = buildClassName('mobile-nav-overlay', [
    isNavActive && 'active'
  ]);

  return (
    <header className={headerClassName}>
      <div className="container header-inner">
        <Link to="/" className="logo">
          {BRAND_NAME}
        </Link>
        
        <nav className={navClassName} id="mainNav">
          {renderNavItems()}
        </nav>
        
        <div className="actions">
          {isAuthenticated ? renderAuthenticatedActions() : renderGuestActions()}
          
          <button 
            className="nav-toggle" 
            onClick={toggleNav}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>
      </div>
      
      <div className={overlayClassName} onClick={closeNav}></div>
    </header>
  );
};

Header.propTypes = {
  onOpenAuthModal: PropTypes.func,
  onOpenFavorites: PropTypes.func,
  onOpenDashboardChoice: PropTypes.func
};

export default Header;