import React, { useState } from 'react';
import '../../styles/faq.css';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book a room?",
      answer: "Find your desired hostel, select a room type, and click 'Book Now' to proceed with payment. You'll need to create an account and provide your student details."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, we use industry-standard encryption to protect your payment information. All transactions are processed through secure payment gateways."
    },
    {
      question: "What happens after I book?",
      answer: "You will receive an instant booking confirmation via email with all the details including check-in instructions and contact information."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking up to 48 hours before your check-in date. Cancellation fees may apply depending on the hostel's policy."
    },
    {
      question: "What amenities are included?",
      answer: "Amenities vary by hostel but typically include WiFi, security, water, and basic furnishing. Check each hostel's listing for specific amenities."
    },
    {
      question: "How do I contact the hostel?",
      answer: "Each hostel listing includes contact information. You can also message the hostel directly through our platform's messaging system."
    },
    {
      question: "What if I have maintenance issues?",
      answer: "You can submit maintenance requests through your student dashboard. The hostel management will be notified and will address the issue promptly."
    },
    {
      question: "Are the hostels verified?",
      answer: "Yes, all hostels on our platform are verified for quality, safety, and legitimacy. We regularly inspect properties to ensure standards are maintained."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-hero">
        <div className="container">
          <h1>Frequently Asked <span className="accent">Questions</span></h1>
          <p>Find answers to common questions about booking hostels and using our platform</p>
        </div>
      </div>

      <div className="container">
        <div className="faq-content">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFAQ(index)}>
                  <span>{faq.question}</span>
                  <i className={`fas fa-chevron-${activeIndex === index ? 'up' : 'down'}`}></i>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="faq-contact">
            <h3>Still have questions?</h3>
            <p>Can't find what you're looking for? Get in touch with our support team.</p>
            <a href="mailto:info@bookmyhostel.com" className="btn primary">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;