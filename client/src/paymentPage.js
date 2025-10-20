import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBookingDetails } from '../services/bookingService';
import { initiatePayment } from '../services/paymentService';
import './PaymentPage.css';

function PaymentPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const bookingDetails = await getBookingDetails(bookingId);
        // The service returns an object with a 'booking' property
        setBooking(bookingDetails.booking); 
        setError('');
      } catch (err) {
        setError('Failed to fetch booking details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    if (!studentName || !studentId || !phoneNumber) {
      setError('Please fill in all student and payment information.');
      return;
    }
    try {
      // Assuming 'mobile_money' is the payment method
      const paymentData = await initiatePayment(bookingId, 'mobile_money', phoneNumber);
      // Handle the response from the payment initiation, e.g., redirect to a payment gateway or show a confirmation
      console.log('Payment initiated:', paymentData);
      alert('Payment initiated successfully! Follow the prompts on your phone.');
    } catch (err) {
      setError('Payment initiation failed. Please check your details and try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="payment-container"><h2>Loading Booking Details...</h2></div>;
  }

  if (error) {
    return <div className="payment-container"><h2>Error</h2><p>{error}</p></div>;
  }

  if (!booking) {
    return <div className="payment-container"><h2>No booking details found.</h2></div>;
  }

  return (
    <div className="payment-container">
      <h2 className="payment-title">Student Payment</h2>
      
      <div className="payment-section">
        <h3 className="section-title">Booking Details</h3>
        <hr className="section-divider" />
        <div className="booking-details-row">
          <div>
            <span className="booking-label">Room Type</span>
            <div className="booking-value">{booking.room.roomType}</div>
          </div>
          <div>
            <span className="booking-label">Room Number</span>
            <div className="booking-value">{booking.room.roomNumber}</div>
          </div>
          <div>
            <span className="booking-label">Price</span>
            <div className="booking-value booking-price">UGX {booking.totalAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="payment-section">
        <h3 className="section-title">Student Information</h3>
        <hr className="section-divider" />
        <label className="input-label" htmlFor="studentName">Full name</label>
        <input id="studentName" className="student-input" type="text" placeholder="e.g., John Doe" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        
        <label className="input-label" htmlFor="studentId">Student ID</label>
        <input id="studentId" className="student-input" type="text" placeholder="e.g., 2300712345" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
      </div>

      <div className="payment-section">
        <h3 className="section-title">Payment Information</h3>
        <hr className="section-divider" />
        <label className="input-label" htmlFor="phoneNumber">Mobile Money Phone Number</label>
        <input id="phoneNumber" className="student-input" type="text" placeholder="e.g., 0771234567" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <p>Payment Method: Mobile Money (MTN/Airtel)</p>
      </div>

      <div className="payment-footer">
        {error && <p className="error-message">{error}</p>}
        <p>Secure payment powered by Flutterwave</p>
        <button className="payment-btn" onClick={handlePayment}>
          Complete Secure Payment
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;