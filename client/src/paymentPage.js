import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingDetails } from '../services/bookingService';
import { initiatePayment } from '../services/paymentService';
import PaymentForm from './components/PaymentForm'; // Import the PaymentForm component
import './PaymentPage.css';

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
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
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePaymentInitiation = async (paymentMethod, paymentDetails) => {
    try {
      // The payment details will contain phone number or card info
      // The backend currently only expects a `phoneNumber` for initiation.
      const paymentData = await initiatePayment(bookingId, paymentMethod, paymentDetails.phoneNumber);
      
      console.log('Payment initiated:', paymentData);
      // On success, you might redirect to a success page or show a modal
      alert('Payment process started! Check your phone for a prompt or follow the next steps.');
      // Example: history.push(`/booking/success/${bookingId}`);

    } catch (err) {
      setError('Payment initiation failed. Please check your details and try again.');
      // This error can be shown inside the PaymentForm component
      throw err; // Re-throw to be caught in the form component
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
      <h2 className="payment-title">Complete Your Booking</h2>
      
      <div className="payment-section">
        <h3 className="section-title">Booking Details</h3>
        <hr className="section-divider" />
        <div className="booking-details-row">
          <div>
            <span className="booking-label">Hostel</span>
            <div className="booking-value">{booking.hostel.name}</div>
          </div>
          <div>
            <span className="booking-label">Room</span>
            <div className="booking-value">{booking.room.roomType} ({booking.room.roomNumber})</div>
          </div>
          <div>
            <span className="booking-label">Price</span>
            <div className="booking-value booking-price">UGX {booking.totalamount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="payment-footer">
        <PaymentForm 
          booking={booking} 
          onPaymentInit={handlePaymentInitiation} 
          onBack={() => history.goBack()} 
        />
      </div>
    </div>
  );
}

export default PaymentPage;
