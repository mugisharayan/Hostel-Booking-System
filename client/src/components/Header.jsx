import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const location = useLocation();

  const handleHomeClick = (e) => {
    e.preventDefault();
    // if already on home, refresh the page
    if (location.pathname === '/') {
      // reload and ensure top-of-page after reload
      window.location.reload();
      try { window.scrollTo(0, 0); } catch (err) { /* ignore */ }
    } else {
      navigate('/');
      setTimeout(() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) {} }, 150);
    }
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    // navigate to home first, then scroll
    navigate('/');
    // give Router time to render the home content, then scroll
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <header>
      <div className="logo">
        <NavLink to="/" className="logo-link">BookMyHostel</NavLink>
      </div>

      <form className="search-bar">
        <input type="text" placeholder="Search for a city or hostel..." name="search" />
        <button type="submit"><i className="fa fa-search"></i></button>
      </form>

      <nav>
        <ul>
          <li>
            <a href="/" onClick={handleHomeClick} className={location.pathname === '/' ? 'active' : ''}>Home</a>
          </li>
          <li><a href="#hostels" onClick={(e) => scrollToSection(e, 'hostels')}>Hostels</a></li>
          <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact Us</a></li>
          <li>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'btn-login active-btn' : 'btn-login'}>
              Log In
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup" className={({ isActive }) => isActive ? 'btn-signup active-btn' : 'btn-signup'}>
              Sign Up
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
