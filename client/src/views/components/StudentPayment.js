import React from "react";
import "./StudentPayment.css";

function StudentPayment() {
  return (
    <div className="payment-container">
      <h2 className="payment-title">Student Payment</h2>
      <div className="payment-section">
        <h3 className="section-title">Booking Details</h3>
        <hr className="section-divider" />
        <div className="booking-details-row">
          <div>
            <span className="booking-label">Room Type</span>
            <div className="booking-value">Single room</div>
          </div>
          <div>
            <span className="booking-label">Room Number</span>
            <div className="booking-value">3</div>
          </div>
          <div>
            <span className="booking-label">Price</span>
            <div className="booking-value booking-price">UGX 1,000,000</div>
          </div>
        </div>
      </div>
      <div className="payment-section">
        <h3 className="section-title">Student Information</h3>
        <hr className="section-divider" />
        <label className="input-label" htmlFor="studentName">Full name</label>
        <input
          id="studentName"
          className="student-input"
          type="text"
          placeholder="e.g., Musiime Martha"
        />
        <label className="input-label" htmlFor="studentId">Student ID</label>
        <input
          id="studentId"
          className="student-input"
          type="text"
          placeholder="e.g., 2300724223"
        />
      </div>
      <div className="payment-section payment-method-section">
        <div className="payment-method-header">
          <span className="payment-method-icon">📱</span>
          <h3 className="section-title">Payment Method</h3>
        </div>
        <div className="payment-method-subtitle">Select your preferred mobile money provider.</div>
        <div className="payment-method-options">
          <div className="payment-method-card">
            <img src="/static/media/mtn-logo.png" alt="MTN Mobile Money" className="payment-method-img" />
            <span className="payment-method-card-label">MTN Mobile Money</span>
          </div>
          <div className="payment-method-card">
            <img src="/static/media/airtel-logo.png" alt="Airtel Money" className="payment-method-img" />
            <span className="payment-method-card-label">Airtel Money</span>
          </div>
        </div>
      </div>
      <div className="payment-footer">
        <p>Secure payment powered by...</p>
        <button className="payment-btn">Complete secure Payment</button>
      </div>
    </div>
  );
}

export default StudentPayment;
