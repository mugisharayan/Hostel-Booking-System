import React from 'react';

function Contact() {
  return (
  <section id="contact" className="contact">
      <div className="contact-container">
        <div className="contact-details">
          <h2>Get in Touch</h2>
          <p>Have questions or need help? We're here for you. Reach out and we'll get back to you shortly.</p>
          <div className="contact-info">
            <div className="info-item">
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              <span>Lumumba Main Street, Kampala, Uganda</span>
            </div>
            <div className="info-item">
              <i className="fas fa-phone-alt" aria-hidden="true"></i>
              <span>+256 756 907 890</span>
            </div>
            <div className="info-item">
              <i className="fas fa-envelope" aria-hidden="true"></i>
              <span>support@bookmyhostel.com</span>
            </div>
          </div>
        </div>
        <form className="contact-form" autoComplete="off">
          <input type="text" id="contact-name" name="name" placeholder="Your Name" required />
          <input type="email" id="contact-email" name="email" placeholder="Your Email" required />
          <textarea id="contact-message" name="message" placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
