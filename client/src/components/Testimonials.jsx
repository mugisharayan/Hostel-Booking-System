import React from 'react';

function Testimonials() {
  return (
    <section className="testimonials">
      <h2>What Our Customers Say</h2>
      <div className="testimonial-grid">
        <div className="testimonial-card">
          <img src="https://images.pexels.com/photos/4009409/pexels-photo-4009409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Happy male student" />
          <div className="testimonial-content">
            <p>"Booking through BookMyHostel was a breeze! I found an amazing place in Kikoni and met some incredible people. The reviews were spot-on."</p>
            <h4>Mugisha Rayan</h4>
          </div>
        </div>
        <div className="testimonial-card">
          <img src="https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Happy female student" />
          <div className="testimonial-content">
            <p>"I use BookMyHostel for all my hostel booking needs. The variety is fantastic, and the prices are unbeatable. Highly recommended because it saves time!"</p>
            <h4>Martha Trisha</h4>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
