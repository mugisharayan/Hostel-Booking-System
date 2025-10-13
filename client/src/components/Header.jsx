import React from 'react';

function Header() {
  return (
    <header>
      <div className="logo">
        <a href="#home">BookMyHostel</a>
      </div>
      <form className="search-bar">
        <input type="text" placeholder="Search for a city or hostel..." name="search" />
        <button type="submit"><i className="fa fa-search"></i></button>
      </form>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#why-us">Why Us</a></li>
          <li><a href="#hostels">Hostels</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#" className="btn-login">Log In / Sign Up</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
