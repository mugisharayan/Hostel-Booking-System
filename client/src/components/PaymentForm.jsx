import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ booking, onPaymentInit, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const balanceDue = booking ? booking.totalamount - booking.paidamount : 0;

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === 'mobile_money') {
      if (!phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^(077|078|075|070|039)\d{7}$/.test(phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid Ugandan phone number';
      }
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!cardDetails.expiry) newErrors.expiry = 'Expiry date is required';
      if (!cardDetails.cvv) newErrors.cvv = 'CVV is required';
      if (!cardDetails.cardName) newErrors.cardName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onPaymentInit(paymentMethod, phoneNumber);
    } catch (error) {
      console.error('Payment initiation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({ ...cardDetails, cardNumber: formatted });
  };

  return (
    <div className="payment-form">
      <h2>Select Payment Method</h2>
      
      <div className="amount-display">
        <div className="amount-label">Amount to Pay</div>
        <div className="amount-value">{balanceDue.toLocaleString()} UGX</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="payment-methods">
          <h3>Choose your payment method</h3>
          
          <div className="method-options">
            <label className={`method-option ${paymentMethod === 'mobile_money' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="mobile_money"
                checked={paymentMethod === 'mobile_money'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="method-content">
                <div className="method-icon">📱</div>
                <div className="method-info">
                  <span className="method-name">Mobile Money</span>
                  <span className="method-description">Pay with MTN or Airtel Money</span>
                </div>
              </div>
            </label>

            <label className={`method-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="method-content">
                <div className="method-icon">💳</div>
                <div className="method-info">
                  <span className="method-name">Credit/Debit Card</span>
                  <span className="method-description">Visa, Mastercard accepted</span>
                </div>
              </div>
            </label>

            <label className={`method-option ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="bank_transfer"
                checked={paymentMethod === 'bank_transfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="method-content">
                <div className="method-icon">🏦</div>
                <div className="method-info">
                  <span className="method-name">Bank Transfer</span>
                  <span className="method-description">Direct bank transfer</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="payment-details">
          {paymentMethod === 'mobile_money' && (
            <div className="method-form">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g., 0771234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={errors.phoneNumber ? 'error' : ''}
                />
                {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                <small>Enter your MTN or Airtel Uganda number</small>
              </div>
              <div className="mobile-money-note">
                <p>💡 You will receive a payment prompt on your phone to complete the transaction.</p>
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="method-form">
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                  className={errors.cardName ? 'error' : ''}
                />
                {errors.cardName && <span className="error-text">{errors.cardName}</span>}
              </div>
              
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                  className={errors.cardNumber ? 'error' : ''}
                />
                {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className={errors.expiry ? 'error' : ''}
                  />
                  {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                </div>
                
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    maxLength="3"
                    className={errors.cvv ? 'error' : ''}
                  />
                  {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'bank_transfer' && (
            <div className="method-form">
              <div className="bank-transfer-info">
                <h4>Bank Transfer Instructions</h4>
                <div className="bank-details">
                  <div className="bank-detail-item">
                    <span>Bank:</span>
                    <strong>Stanbic Bank Uganda</strong>
                  </div>
                  <div className="bank-detail-item">
                    <span>Account Name:</span>
                    <strong>University Hostels Ltd</strong>
                  </div>
                  <div className="bank-detail-item">
                    <span>Account Number:</span>
                    <strong>9030012345678</strong>
                  </div>
                  <div className="bank-detail-item">
                    <span>Reference:</span>
                    <strong>HOSTEL{booking?._id}</strong>
                  </div>
                  <div className="bank-detail-item">
                    <span>Amount:</span>
                    <strong>{balanceDue.toLocaleString()} UGX</strong>
                  </div>
                </div>
                <div className="transfer-note">
                  <p>📧 After making the transfer, please send the receipt to payments@unihostels.ac.ug</p>
                  <p>⏰ Your booking will be confirmed within 24 hours of payment verification.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onBack} 
            className="back-btn"
            disabled={loading}
          >
            ← Back
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="pay-now-btn"
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Processing...
              </>
            ) : (
              `Pay ${balanceDue.toLocaleString()} UGX`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;


