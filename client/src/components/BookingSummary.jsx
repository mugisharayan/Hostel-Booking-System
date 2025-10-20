

import React from 'react';

const PaymentSummary = ({ booking, onProceed }) => {
  if (!booking) return null;

  return (
    <div className="payment-summary">
      <h2>Booking Summary</h2>
      
      <div className="summary-details">
        <div className="summary-item">
          <span>Hostel:</span>
          <span>{booking.hostel?.name}</span>
        </div>
        
        <div className="summary-item">
          <span>Room:</span>
          <span>{booking.room?.roomNumber} ({booking.room?.roomType})</span>
        </div>
        
        <div className="summary-item">
          <span>Duration:</span>
          <span>{booking.academicyear} - {booking.semester} Semester</span>
        </div>
        
        <div className="summary-item">
          <span>Check-in:</span>
          <span>{new Date(booking.checkindate).toLocaleDateString()}</span>
        </div>
        
        <div className="summary-item">
          <span>Check-out:</span>
          <span>{new Date(booking.checkoutdate).toLocaleDateString()}</span>
        </div>
        
        <div className="summary-item total">
          <span>Total Amount:</span>
          <span>{booking.totalamount?.toLocaleString()} UGX</span>
        </div>
        
        <div className="summary-item paid">
          <span>Already Paid:</span>
          <span>{booking.paidamount?.toLocaleString()} UGX</span>
        </div>
        
        <div className="summary-item balance">
          <span>Balance Due:</span>
          <span>{(booking.totalamount - booking.paidamount)?.toLocaleString()} UGX</span>
        </div>
      </div>
      
      <button className="proceed-btn" onClick={onProceed}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default PaymentSummary;