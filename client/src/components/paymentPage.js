
import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('mobile-money');
  const [fileName, setFileName] = useState('No file chosen');

  // Extract booking details from URL params
  const hostel = searchParams.get('hostel');
  const room = searchParams.get('room');
  const price = parseInt(searchParams.get('price') || '0');
  const fullName = searchParams.get('fullName');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const course = searchParams.get('course');

  const serviceFee = 5000;
  const totalPrice = price + serviceFee;

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setFileName('No file chosen'); // Reset file name when changing method
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('No file chosen');
    }
  };

  const handleApplyPromo = () => {
    // In a real app, you'd validate the code and update price
    // showToast('Promo code applied!');
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();

    // Basic validation for bank transfer proof
    if (paymentMethod === 'bank-transfer' && fileName === 'No file chosen') {
      // showToast('Please upload payment proof for bank transfer.', true);
      return;
    }

    // Create the new booking record
    const newBooking = {
      hostel,
      room,
      price,
      bookingDate: new Date().toISOString(),
      status: 'Confirmed', // Default status for a new booking
      paymentMethod,
      // In a real app, you'd also save payment proof URL if uploaded
    };

    // Create/update a separate user profile object
    const userProfile = {
      fullName,
      email,
      phone,
      course,
      profilePicture: '', // Initialize with empty or default
      role: 'student', // New users booking are always students
      // Add other profile details from booking form if needed
    };

    // Use the login function from context to set the user and their first booking
    login(userProfile, [newBooking]);
    // Redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <main className="booking-page">
      <div className="container">
        <div className="booking-page-header">
          <button onClick={() => navigate(-1)} className="back-link"><i className="fa-solid fa-arrow-left"></i> Back to Booking Details</button>
          <h1>Confirm and Pay</h1>
          <p>You're almost there! Please review your details and select a payment method to complete your booking.</p>
        </div>

        <div className="booking-layout">
          {/* Left Column: Payment Options */}
          <div className="payment-options-col">
            <h3>1. Choose Payment Method</h3>
            <div className="payment-method-selector">
              <label className="payment-method-option">
                <input type="radio" name="payment-method" value="mobile-money" checked={paymentMethod === 'mobile-money'} onChange={handlePaymentMethodChange} />
                <div className="payment-method-content">
                  <i className="fa-solid fa-mobile-screen-button"></i>
                  <span>Mobile Money</span>
                </div>
              </label>
              <label className="payment-method-option">
                <input type="radio" name="payment-method" value="credit-card" checked={paymentMethod === 'credit-card'} onChange={handlePaymentMethodChange} />
                <div className="payment-method-content">
                  <i className="fa-solid fa-credit-card"></i>
                  <span>Credit/Debit Card</span>
                </div>
              </label>
              <label className="payment-method-option">
                <input type="radio" name="payment-method" value="bank-transfer" checked={paymentMethod === 'bank-transfer'} onChange={handlePaymentMethodChange} />
                <div className="payment-method-content">
                  <i className="fa-solid fa-building-columns"></i>
                  <span>Bank Transfer</span>
                </div>
              </label>
            </div>

            <div className="payment-details-forms">
              {/* Mobile Money Form */}
              {paymentMethod === 'mobile-money' && (
                <div className="payment-form" id="mobile-money-form">
                  <h4>Enter Mobile Money Number</h4>
                  <div className="form-group">
                    <label htmlFor="mm-phone">Phone Number</label>
                    <input type="tel" id="mm-phone" placeholder="e.g., 0771234567" />
                  </div>
                  <p className="form-note">A payment prompt will be sent to this number.</p>
                </div>
              )}
              {/* Credit Card Form */}
              {paymentMethod === 'credit-card' && (
                <div className="payment-form" id="credit-card-form">
                  <h4>Enter Card Details</h4>
                  <div className="form-group">
                    <label htmlFor="card-number">Card Number</label>
                    <input type="text" id="card-number" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="card-expiry">Expiry Date</label>
                      <input type="text" id="card-expiry" placeholder="MM / YY" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="card-cvc">CVC</label>
                      <input type="text" id="card-cvc" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
              {/* Bank Transfer Info */}
              {paymentMethod === 'bank-transfer' && (
                <div className="payment-form" id="bank-transfer-form">
                  <h4>Bank Transfer Instructions</h4>
                  <p>Please transfer the total amount to the following bank account and use your student number as the payment reference.</p>
                  <ul className="bank-details-list">
                    <li><strong>Bank Name:</strong> Stanbic Bank</li>
                    <li><strong>Account Name:</strong> BookMyHostel Ltd</li>
                    <li><strong>Account Number:</strong> 9030012345678</li>
                  </ul>
                  <div className="form-group" style={{ marginTop: '20px' }}>
                    <label htmlFor="paymentProofUpload">Upload Payment Proof</label>
                    <div className="file-upload-wrapper">
                      <input type="file" id="paymentProofUpload" className="file-input" accept="image/*,.pdf" required onChange={handleFileUpload} />
                      <label htmlFor="paymentProofUpload" className="file-upload-label">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <span>Choose File</span>
                      </label>
                      <span className="file-name-display">{fileName}</span>
                    </div>
                    <p className="form-note">Please upload a screenshot or PDF of your transaction receipt.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="promo-code-section">
              <h4>Have a Promo Code?</h4>
              <div className="promo-input-wrapper">
                <input type="text" id="promoCode" placeholder="Enter code" />
                <button className="btn outline small" onClick={handleApplyPromo}>Apply</button>
              </div>
            </div>

            <div className="security-info-section">
              <i className="fa-solid fa-lock"></i>
              <div>
                <strong>Secure Payment</strong>
                <p>All transactions are secure and encrypted. We do not store your payment details.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="booking-summary-col">
            <div className="summary-card">
              <h3>Final Summary</h3>
              <div className="summary-item" id="summaryHostel">
                <small>Hostel</small>
                <span>{hostel || 'N/A'}</span>
              </div>
              <div className="summary-item" id="summaryRoom">
                <small>Room Type</small>
                <span>{room || 'N/A'}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-item" id="summaryBasePrice">
                <small>Room Price</small>
                <span>UGX {price.toLocaleString()}</span>
              </div>
              <div className="summary-item" id="summaryServiceFee">
                <small>Service Fee</small>
                <span>UGX {serviceFee.toLocaleString()}</span>
              </div>
              <div className="summary-item total" id="summaryTotalPrice">
                <small>Total Price</small>
                <span>UGX {totalPrice.toLocaleString()}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-item" id="summaryName">
                <small>Full Name</small>
                <span>{fullName || 'N/A'}</span>
              </div>
              <div className="summary-item" id="summaryEmail">
                <small>Email</small>
                <span>{email || 'N/A'}</span>
              </div>
              <div className="summary-item" id="summaryPhone">
                <small>Phone</small>
                <span>{phone || 'N/A'}</span>
              </div>
              <div className="summary-item" id="summaryCourse">
                <small>Course</small>
                <span>{course || 'N/A'}</span>
              </div>

              <button
                className="btn primary full-width book-btn"
                id="confirmPayBtn"
                style={{ marginTop: '20px' }}
                onClick={handleConfirmPayment}
              >
                {paymentMethod === 'mobile-money' ? 'Pay with Mobile Money' : paymentMethod === 'credit-card' ? 'Pay with Card' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;