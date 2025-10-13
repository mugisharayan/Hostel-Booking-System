import React from 'react';

function WhyUs() {
  return (
    <section id="why-us" className="why-us dark-theme">
      <h2>Why Choose Us?</h2>
      <div className="why-us-cards">
        <div className="card">
          <i className="fas fa-check-circle"></i>
          <h3>Verified Listing</h3>
          <p>Every hostel is checked by our team to ensure quality and safety.</p>
        </div>
        <div className="card">
          <i className="fas fa-search"></i>
          <h3>Advanced Search</h3>
          <p>Easily filter by price, rating, and location to find your perfect match.</p>
        </div>
        <div className="card">
          <i className="fas fa-wallet"></i>
          <h3>Transparent Pricing</h3>
          <p>No hidden fees. See all costs upfront for single and double rooms.</p>
        </div>
      </div>
    </section>
  );
}

export default WhyUs;
