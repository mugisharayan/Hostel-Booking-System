import React from 'react';

function WhyUs() {
  return (
    <section id="why-us" className="why-us dark-theme">
      <h2>Why Choose Us?</h2>
      <div className="why-us-cards">
        <div className="card">
          <i className="fas fa-globe-americas"></i>
          <h3>Global Destinations</h3>
          <p>Explore thousands of hostels in top destinations worldwide, from bustling cities to serene landscapes.</p>
        </div>
        <div className="card">
          <i className="fas fa-check-circle"></i>
          <h3>Verified Reviews</h3>
          <p>Make confident decisions with access to millions of reviews from a community of fellow travelers.</p>
        </div>
        <div className="card">
          <i className="fas fa-wallet"></i>
          <h3>Best Price Guarantee</h3>
          <p>We offer the best prices on beds and private rooms, ensuring your travel budget goes further.</p>
        </div>
      </div>
    </section>
  );
}

export default WhyUs;
