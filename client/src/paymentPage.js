import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentSummary from './PaymentSummary';
import PaymentForm from './PaymentForm';
import PaymentStatus from './PaymentStatus';
import { getBookingDetails, initiatePayment } from '../../services/bookingService';
import './PaymentPage.css';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [currentStep, setCurrentStep] = useState('summary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      const bookingDetails = await getBookingDetails(bookingId);
      setBooking(bookingDetails);
      setLoading(false);
    } catch (err) {
      setError('Failed to load booking details');
      setLoading(false);
    }
  };

  const handlePaymentInit = async (paymentMethod, phoneNumber) => {
    try {
      setLoading(true);
      const response = await initiatePayment(bookingId, paymentMethod, phoneNumber);
      setPaymentData(response);
      setCurrentStep('processing');
    } catch (err) {
      setError('Failed to initiate payment');
      setLoading(false);
    }
  };

  const handlePaymentComplete = (success, receiptUrl) => {
    if (success) {
      setCurrentStep('success');
    } else {
      setCurrentStep('failed');
    }
  };

  if (loading) {
    return <div className="loading">Loading payment details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Complete Your Hostel Booking</h1>
        
        {currentStep === 'summary' && (
          <PaymentSummary 
            booking={booking} 
            onProceed={() => setCurrentStep('form')}
          />
        )}
        
        {currentStep === 'form' && (
          <PaymentForm 
            booking={booking}
            onPaymentInit={handlePaymentInit}
            onBack={() => setCurrentStep('summary')}
          />
        )}
        
        {currentStep === 'processing' && (
          <PaymentStatus 
            paymentData={paymentData}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
        
        {currentStep === 'success' && (
          <div className="success-message">
            <h2>Payment Successful! 🎉</h2>
            <p>Your hostel booking has been confirmed.</p>
            <p>A receipt and verification token have been sent to your email.</p>
            <button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        )}
        
        {currentStep === 'failed' && (
          <div className="error-message">
            <h2>Payment Failed</h2>
            <p>Please try again or use a different payment method.</p>
            <button onClick={() => setCurrentStep('form')}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;