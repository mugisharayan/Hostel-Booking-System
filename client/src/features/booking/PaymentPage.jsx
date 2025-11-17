import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import paymentService from '../../service/payment.service';
import bookingService from '../../service/booking.service';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('mobile-money');
  const [fileName, setFileName] = useState('No file chosen');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  const hostel = searchParams.get('hostel');
  const room = searchParams.get('room');
  const price = parseInt(searchParams.get('price') || '0');
  const fullName = searchParams.get('fullName');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const course = searchParams.get('course');

  const serviceFee = 5000;
  const totalPrice = price + serviceFee;

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setFileName('No file chosen');
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('No file chosen');
    }
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate payment method fields
      if (paymentMethod === 'mobile-money' && !mobileMoneyPhone) {
        throw new Error('Please enter mobile money phone number');
      }
      if (paymentMethod === 'credit-card' && (!cardNumber || !cardExpiry || !cardCVC)) {
        throw new Error('Please fill in all card details');
      }
      if (paymentMethod === 'bank-transfer' && fileName === 'No file chosen') {
        throw new Error('Please upload payment proof');
      }

      // Process payment based on method
      let paymentResult;
      if (paymentMethod === 'mobile-money') {
        paymentResult = await paymentService.processMobileMoneyPayment(mobileMoneyPhone, totalPrice, '1234');
      } else if (paymentMethod === 'credit-card') {
        const cardData = { cardNumber, expiry: cardExpiry, cvc: cardCVC };
        paymentResult = await paymentService.processCreditCardPayment(cardData, totalPrice);
      } else {
        paymentResult = {
          success: true,
          transactionId: paymentService.generateTransactionId(),
          message: 'Bank transfer recorded'
        };
      }

      // Create booking and payment records
      const bookingData = {
        hostel,
        room,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 4))
      };
      
      const createdBooking = await bookingService.createBooking(bookingData);
      
      await paymentService.createPayment(createdBooking._id, {
        amount: totalPrice,
        paymentMethod: paymentMethod === 'mobile-money' ? 'Mobile Money' : 
                      paymentMethod === 'credit-card' ? 'Credit Card' : 'Bank Transfer',
        transactionId: paymentResult.transactionId
      });

      const userProfile = {
        fullName,
        email,
        phone,
        course,
        profilePicture: '',
        role: 'student',
        token: 'mock-token'
      };

      const newBooking = {
        _id: createdBooking._id,
        hostel,
        room,
        price,
        bookingDate: new Date().toISOString(),
        status: 'Confirmed',
        paymentMethod,
        transactionId: paymentResult.transactionId
      };

      login(userProfile, [newBooking]);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="payment-page-modern">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn-modern">
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        
        <div className="payment-hero">
          <div className="payment-hero-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1>Secure Payment</h1>
          <p>Complete your booking in just a few clicks</p>
        </div>

        <div className="payment-container-modern">
          <div className="payment-summary-modern">
            <div className="summary-header-modern">
              <i className="fa-solid fa-receipt"></i>
              <h3>Booking Summary</h3>
            </div>
            <div className="summary-details-modern">
              <div className="summary-row-modern">
                <span className="label-modern"><i className="fa-solid fa-building"></i> {hostel}</span>
              </div>
              <div className="summary-row-modern">
                <span className="label-modern"><i className="fa-solid fa-door-open"></i> {room}</span>
              </div>
              <div className="summary-divider-modern"></div>
              <div className="summary-row-modern">
                <span>Room Price</span>
                <span>UGX {price.toLocaleString()}</span>
              </div>
              <div className="summary-row-modern">
                <span>Service Fee</span>
                <span>UGX {serviceFee.toLocaleString()}</span>
              </div>
              <div className="summary-total-modern">
                <span>Total</span>
                <span>UGX {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="payment-methods-modern">
            <h3>Select Payment Method</h3>
            <div className="payment-cards-grid">
              <div className={`payment-card-modern ${paymentMethod === 'mobile-money' ? 'active' : ''}`} onClick={() => handlePaymentMethodChange('mobile-money')}>
                <div className="payment-card-icon"><i className="fa-solid fa-mobile-screen-button"></i></div>
                <span>Mobile Money</span>
                <div className="check-icon"><i className="fa-solid fa-circle-check"></i></div>
              </div>
              <div className={`payment-card-modern ${paymentMethod === 'credit-card' ? 'active' : ''}`} onClick={() => handlePaymentMethodChange('credit-card')}>
                <div className="payment-card-icon"><i className="fa-solid fa-credit-card"></i></div>
                <span>Card</span>
                <div className="check-icon"><i className="fa-solid fa-circle-check"></i></div>
              </div>
              <div className={`payment-card-modern ${paymentMethod === 'bank-transfer' ? 'active' : ''}`} onClick={() => handlePaymentMethodChange('bank-transfer')}>
                <div className="payment-card-icon"><i className="fa-solid fa-building-columns"></i></div>
                <span>Bank Transfer</span>
                <div className="check-icon"><i className="fa-solid fa-circle-check"></i></div>
              </div>
            </div>
            
            {error && (
              <div style={{background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center'}}>
                <i className="fa-solid fa-exclamation-triangle"></i> {error}
              </div>
            )}
            
            <div className="payment-form-modern">
              {paymentMethod === 'mobile-money' && (
                <div className="form-content-modern">
                  <input 
                    type="tel" 
                    placeholder="Enter phone number (e.g., 0771234567)" 
                    className="input-modern" 
                    value={mobileMoneyPhone}
                    onChange={(e) => setMobileMoneyPhone(e.target.value)}
                  />
                  <p className="hint-modern"><i className="fa-solid fa-info-circle"></i> A prompt will be sent to your phone</p>
                </div>
              )}
              {paymentMethod === 'credit-card' && (
                <div className="form-content-modern">
                  <input 
                    type="text" 
                    placeholder="Card number" 
                    className="input-modern" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <div className="input-row-modern">
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="input-modern" 
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="CVC" 
                      className="input-modern" 
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {paymentMethod === 'bank-transfer' && (
                <div className="form-content-modern">
                  <div className="bank-info-modern">
                    <p><strong>Stanbic Bank</strong></p>
                    <p>BookMyHostel Ltd</p>
                    <p>9030012345678</p>
                  </div>
                  <div className="file-upload-modern">
                    <input type="file" id="proof" className="file-input" accept="image/*,.pdf" onChange={handleFileUpload} />
                    <label htmlFor="proof" className="file-label-modern">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <span>{fileName}</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <button className="pay-btn-modern" onClick={handleConfirmPayment} disabled={isLoading}>
              {isLoading ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</>
              ) : (
                <><i className="fa-solid fa-lock"></i> Complete Payment - UGX {totalPrice.toLocaleString()}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
