import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import bookingService from '../../service/booking.service';
import paymentService from '../../service/payment.service';
import authService from '../../service/auth.service';
import hostelService from '../../service/hostel.service';
import receiptService from '../../service/receipt.service';
import userService from '../../service/user.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/booking-page.css';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userProfile, loginWithUserData } = useContext(AuthContext);
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!userProfile) {
      console.log('No user profile, redirecting to home with auth modal');
      navigate('/');
    }
  }, [userProfile, navigate, searchParams]);

  // Don't render anything if no user profile
  if (!userProfile) {
    return null;
  }

  // Check for active bookings on page load
  React.useEffect(() => {
    const checkActiveBooking = async () => {
      if (userProfile) {
        try {
          // Add small delay to ensure any recent cancellations are processed
          await new Promise(resolve => setTimeout(resolve, 500));
          const activeBookings = await bookingService.checkActiveBookings();
          if (activeBookings.length > 0) {
            setShowActiveBookingModal(true);
          }
        } catch (error) {
          console.error('Failed to check active bookings:', error);
        }
      }
    };
    checkActiveBooking();
  }, [userProfile]);

  const hostelName = searchParams.get('hostel');
  const roomName = searchParams.get('room');
  const roomPrice = searchParams.get('price');
  const hostelImage = searchParams.get('image');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: userProfile?.phone || '',
    gender: userProfile?.gender || '',
    dob: userProfile?.dateOfBirth ? new Date(userProfile.dateOfBirth).toISOString().split('T')[0] : '',
    course: userProfile?.course || '',
    yearOfStudy: userProfile?.yearOfStudy || '',
    studentNumber: userProfile?.studentNumber || '',
    residence: userProfile?.residence || '',
    nextOfKinName: userProfile?.nextOfKinName || '',
    nextOfKinContact: userProfile?.nextOfKinContact || '',
    guardianName: userProfile?.guardianName || '',
    guardianContact: userProfile?.guardianContact || '',
    notes: '',
    healthIssues: '',
    studentIdUpload: null,
  });
  const [showProfilePrompt, setShowProfilePrompt] = useState(!userProfile?.profileCompleted);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  const [paymentMethod, setPaymentMethod] = useState('mobile-money');
  const [paymentFileName, setPaymentFileName] = useState('No file chosen');
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [showActiveBookingModal, setShowActiveBookingModal] = useState(false);
  
  const processCreditCardPayment = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const cardData = {
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiry: cardExpiry,
        cvc: cardCVC
      };
      
      const result = await paymentService.processCreditCardPayment(cardData, totalPrice);
      sessionStorage.setItem('paymentResult', JSON.stringify(result));
      await completeBooking();
    } catch (error) {
      setError(error.message || 'Card payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const price = parseInt(roomPrice || '0');
  const serviceFee = 5000;
  const totalPrice = price + serviceFee;
  const MERCHANT_NUMBER = '0740099098';

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Validate input based on field type
    if (type === 'tel' && value && !/^[0-9]*$/.test(value)) {
      return; // Only allow numbers for phone fields
    }
    
    if ((name === 'nextOfKinName' || name === 'guardianName') && value && !/^[A-Za-z\s]*$/.test(value)) {
      return; // Only allow letters and spaces for names
    }
    
    if (name === 'studentNumber' && value && !/^[0-9]*$/.test(value)) {
      return; // Only allow numbers for student number
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));

    if (type === 'file' && files.length > 0) {
      setFileName(files[0].name);
    } else if (type === 'file') {
      setFileName('No file chosen');
    }
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setPaymentFileName('No file chosen');
  };

  const handlePaymentFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentFileName(e.target.files[0].name);
    } else {
      setPaymentFileName('No file chosen');
    }
  };

  const handleConfirmPayment = async () => {
    setError('');
    
    // Validate payment method specific fields
    if (paymentMethod === 'mobile-money' && !mobileMoneyPhone) {
      setError('Please enter your mobile money phone number');
      return;
    }
    if (paymentMethod === 'credit-card' && (!cardNumber || !cardExpiry || !cardCVC)) {
      setError('Please fill in all card details');
      return;
    }
    if (paymentMethod === 'bank-transfer' && paymentFileName === 'No file chosen') {
      setError('Please upload payment proof for bank transfer');
      return;
    }
    
    // Process different payment methods
    if (paymentMethod === 'mobile-money') {
      setShowPinModal(true);
    } else if (paymentMethod === 'credit-card') {
      await processCreditCardPayment();
    } else {
      // Bank transfer - complete booking
      await completeBooking();
    }
  };
  
  const completeBooking = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Double-check for existing active bookings with fresh data
      const activeBookings = await bookingService.checkActiveBookings();
      if (activeBookings.length > 0) {
        console.log('Active bookings found:', activeBookings);
        setError('You already have an active booking. Please cancel or wait for it to expire before booking again.');
        setShowActiveBookingModal(true);
        setIsLoading(false);
        return;
      }
      
      // Resolve hostel and room IDs
      let hostelId, roomId;
      
      try {
        const hostel = await hostelService.findHostelByName(hostelName);
        if (hostel) {
          hostelId = hostel._id;
          const room = await hostelService.findRoomByName(hostelId, roomName);
          roomId = room?._id;
        }
      } catch (resolveError) {
        console.warn('Could not resolve hostel/room IDs, using names:', resolveError.message);
      }
      
      // Create booking with IDs or fallback to names
      const bookingData = {
        hostel: hostelId || hostelName,
        room: roomId || roomName,
        hostelName: hostelName,
        roomName: roomName,
        totalAmount: totalPrice,
        paymentMethod: paymentMethod === 'mobile-money' ? 'Mobile Money' : 
                      paymentMethod === 'credit-card' ? 'Credit Card' : 'Bank Transfer',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 4))
      };
      
      const createdBooking = await bookingService.createBooking(bookingData);
      
      // Create payment
      const paymentData = {
        amount: totalPrice,
        paymentMethod: paymentMethod === 'mobile-money' ? 'Mobile Money' : 
                      paymentMethod === 'credit-card' ? 'Credit Card' : 'Bank Transfer',
        transactionId: paymentService.generateTransactionId()
      };
      
      await paymentService.createPayment(createdBooking._id, paymentData);
      
      // Store booking for custodian dashboard (real-time simulation)
      const custodianBooking = {
        _id: createdBooking._id || Date.now().toString(),
        studentName: userProfile?.fullName || userProfile?.name,
        studentEmail: userProfile?.email,
        hostelName: hostelName,
        roomName: roomName,
        totalAmount: totalPrice,
        status: 'active',
        createdAt: new Date().toISOString(),
        bookingDate: new Date().toISOString(),
        paymentMethod: paymentMethod === 'mobile-money' ? 'Mobile Money' : 
                      paymentMethod === 'credit-card' ? 'Credit Card' : 'Bank Transfer',
        user: {
          name: userProfile?.fullName || userProfile?.name,
          email: userProfile?.email
        }
      };
      
      // Add to custodian bookings for real-time display
      const existingBookings = JSON.parse(localStorage.getItem('custodianBookings') || '[]');
      const recentBookings = JSON.parse(localStorage.getItem('recentBookings') || '[]');
      
      existingBookings.unshift(custodianBooking);
      recentBookings.unshift(custodianBooking);
      
      localStorage.setItem('custodianBookings', JSON.stringify(existingBookings));
      localStorage.setItem('recentBookings', JSON.stringify(recentBookings.slice(0, 10)));
      
      console.log('Booking created in database:', createdBooking);
      console.log('Booking stored for custodian:', custodianBooking);
      console.log('Total custodian bookings:', existingBookings.length);
      
      // Get payment result from session
      const storedPaymentResult = JSON.parse(sessionStorage.getItem('paymentResult') || '{}');
      
      sessionStorage.removeItem('paymentResult');
      sessionStorage.removeItem('tempUser');
      
      setCurrentStep(3);
    } catch (error) {
      setError(error.message || 'Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadReceipt = async () => {
    setDownloadingReceipt(true);
    try {
      const receiptData = {
        hostelName: hostelName,
        roomName: roomName,
        price: price,
        amount: totalPrice,
        paymentMethod: paymentMethod === 'mobile-money' ? 'Mobile Money' : 
                      paymentMethod === 'credit-card' ? 'Credit Card' : 'Bank Transfer',
        studentName: userProfile?.fullName || userProfile?.name,
        studentEmail: userProfile?.email,
        studentPhone: userProfile?.phone || formData.phone,
        bookingDate: new Date().toISOString(),
        transactionId: JSON.parse(sessionStorage.getItem('paymentResult') || '{}').transactionId || 'BMH' + Date.now(),
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 4))
      };
      
      await receiptService.generateReceipt(receiptData);
    } catch (error) {
      console.error('Receipt download failed:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloadingReceipt(false);
    }
  };

  const handlePinSubmit = async () => {
    if (!pin || pin.length !== 4) {
      setError('Please enter a valid 4-digit PIN');
      return;
    }
    
    setIsProcessing(true);
    setPaymentStatus('Initiating payment...');
    
    try {
      setPaymentStatus('Sending request to ' + mobileMoneyPhone + '...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentStatus('Verifying PIN...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentStatus('Processing payment to ' + MERCHANT_NUMBER + '...');
      
      // Process mobile money payment
      const paymentResult = await paymentService.processMobileMoneyPayment(mobileMoneyPhone, totalPrice, pin);
      
      setPaymentStatus('Payment successful! ✓');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store transaction details
      sessionStorage.setItem('paymentResult', JSON.stringify(paymentResult));
      
      setIsProcessing(false);
      setShowPinModal(false);
      setPin('');
      setPaymentStatus('');
      
      await completeBooking();
    } catch (error) {
      setIsProcessing(false);
      setPaymentStatus('');
      setError(error.message || 'Payment failed. Please try again.');
    }
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('Please accept the terms and conditions.');
      return;
    }
    
    if (!userProfile) {
      setError('Please log in to continue with booking.');
      return;
    }
    
    // Validate required fields
    if (!formData.phone || !formData.gender || !formData.dob || !formData.yearOfStudy || 
        !formData.studentNumber || !formData.residence || !formData.nextOfKinName || 
        !formData.nextOfKinContact || !formData.guardianName || !formData.guardianContact) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Save profile data for future bookings
    try {
      await userService.saveBookingProfile(formData);
    } catch (error) {
      console.warn('Failed to save profile:', error.message);
    }
    
    setCurrentStep(2);
  };

  return (
    <main className="booking-page">
      {/* Hero Section */}
      <section className="booking-hero-section">
        <div className="floating-home-icons">
          <i className="fa-solid fa-home floating-home-1"></i>
          <i className="fa-solid fa-home floating-home-2"></i>
          <i className="fa-solid fa-home floating-home-3"></i>
          <i className="fa-solid fa-home floating-home-4"></i>
          <i className="fa-solid fa-home floating-home-5"></i>
          <i className="fa-solid fa-home floating-home-6"></i>
        </div>
        <div className="booking-hero-container">
          <div className="booking-hero-content">
            <h1 className="booking-hero-title">Complete Your <span className="booking-animated">Booking</span></h1>
            <p className="booking-hero-subtitle">Please fill in your details to secure your room. This should only take a few minutes.</p>
            <button onClick={() => navigate(-1)} className="back-link">
              <i className="fa-solid fa-arrow-left"></i> Back to Hostel
            </button>
          </div>
        </div>
      </section>
      
      <div className="progress-steps">
        <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span>Booking Details</span>
        </div>
        <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span>Payment</span>
        </div>
        <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="booking-fullwidth-section">
            {/* Booking Summary at Top - Only show on step 1 */}
            {currentStep === 1 && (
            <div className="booking-summary-top">
              <div>
                <div className="summary-hostel-image">
                  <img src={hostelImage || 'https://via.placeholder.com/300x200.png?text=Hostel+Image'} alt="Selected hostel image" />
                </div>
                <div className="summary-details">
                  <h3>Booking Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-item-inline">
                      <small>Student</small>
                      <span>{userProfile?.fullName || userProfile?.name || 'N/A'}</span>
                    </div>
                    <div className="summary-item-inline">
                      <small>Hostel</small>
                      <span>{hostelName || 'N/A'}</span>
                    </div>
                    <div className="summary-item-inline">
                      <small>Room Type</small>
                      <span>{roomName || 'N/A'}</span>
                    </div>
                    <div className="summary-item-inline total-inline">
                      <small>Total Price</small>
                      <span>UGX {parseInt(roomPrice || 0).toLocaleString()} <small>/ semester</small></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
            
            {/* Form Below */}
            <div className="booking-form-col">
            {error && (
              <div className="error-message" style={{background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center'}}>
                <i className="fa-solid fa-exclamation-triangle"></i> {error}
              </div>
            )}
            {showProfilePrompt && (
              <div className="profile-prompt-card" style={{background: '#f0f9ff', border: '2px solid #0ea5e9', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center'}}>
                <i className="fa-solid fa-user-plus" style={{fontSize: '32px', color: '#0ea5e9', marginBottom: '12px'}}></i>
                <h3 style={{color: '#1e293b', marginBottom: '8px'}}>Complete Your Profile</h3>
                <p style={{color: '#64748b', marginBottom: '16px'}}>Save time on future bookings by completing your profile once</p>
                <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                  <button type="button" onClick={() => setShowProfilePrompt(false)} style={{padding: '8px 16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer'}}>Skip for Now</button>
                  <button type="button" onClick={() => navigate('/profile')} style={{padding: '8px 16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>Complete Profile</button>
                </div>
              </div>
            )}
            {currentStep === 1 && (
            <form className="booking-form" onSubmit={handleProceedToPayment}>
              <div className="form-sections-row">
              <div className="form-section">
                <h3><span className="section-number">1</span> Personal Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="phone" aria-label="Telephone Number">Telephone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="e.g., 0771234567" required value={formData.phone} onChange={handleInputChange} pattern="[0-9]{10}" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender" aria-label="Gender">Gender</label>
                    <select id="gender" name="gender" required value={formData.gender} onChange={handleInputChange}>
                      <option value="" disabled aria-label="Select your gender">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob" aria-label="Date of Birth">Date of Birth</label>
                    <input type="date" id="dob" name="dob" required value={formData.dob} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h3><span className="section-number">2</span> Academic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="course" aria-label="Course / Program">Course / Program</label>
                    <input type="text" id="course" name="course" placeholder="e.g., Bachelor of Computer Science" required value={formData.course} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="yearOfStudy" aria-label="Year of Study">Year of Study</label>
                    <select id="yearOfStudy" name="yearOfStudy" required value={formData.yearOfStudy} onChange={handleInputChange}>
                      <option value="" disabled>Select your year</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                      <option value="5">Postgraduate</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="studentNumber" aria-label="Student Number">Student Number</label>
                    <input type="text" id="studentNumber" name="studentNumber" placeholder="e.g., 2100712345" required value={formData.studentNumber} onChange={handleInputChange} pattern="[0-9]+" />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label htmlFor="studentIdUpload" aria-label="Upload University ID or Admission Letter">Upload University ID or Admission Letter</label>
                  <div className="file-upload-wrapper">
                    <input type="file" id="studentIdUpload" name="studentIdUpload" className="file-input" required accept="image/*,.pdf" onChange={handleInputChange} />
                    <label htmlFor="studentIdUpload" className="file-upload-label">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <span>Choose File</span>
                    </label>
                    <span className="file-name-display">{fileName}</span>
                  </div>
                </div>
              </div>
              </div>

              <div className="form-sections-row">
              <div className="form-section">
                <h3><span className="section-number">3</span> Contact & Emergency Details</h3>
                <div className="form-group">
                  <label htmlFor="residence" aria-label="Place of Residence">Place of Residence</label>
                  <input type="text" id="residence" name="residence" placeholder="e.g., Mbarara, Uganda" required value={formData.residence} onChange={handleInputChange} />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nextOfKinName" aria-label="Next of Kin's Name">Next of Kin's Name</label>
                    <input type="text" id="nextOfKinName" name="nextOfKinName" required value={formData.nextOfKinName} onChange={handleInputChange} pattern="[A-Za-z\s]+" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nextOfKinContact" aria-label="Next of Kin's Contact">Next of Kin's Contact</label>
                    <input type="tel" id="nextOfKinContact" name="nextOfKinContact" required value={formData.nextOfKinContact} onChange={handleInputChange} pattern="[0-9]{10}" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="guardianName" aria-label="Parent/Guardian's Name">Parent/Guardian's Name</label>
                    <input type="text" id="guardianName" name="guardianName" required value={formData.guardianName} onChange={handleInputChange} pattern="[A-Za-z\s]+" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="guardianContact" aria-label="Parent/Guardian's Contact">Parent/Guardian's Contact</label>
                    <input type="tel" id="guardianContact" name="guardianContact" required value={formData.guardianContact} onChange={handleInputChange} pattern="[0-9]{10}" />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h3><span className="section-number">4</span> Additional Information</h3>
                <div className="form-group">
                  <label htmlFor="notes" aria-label="Additional Notes or Special Requests (Optional)">Additional Notes or Special Requests (Optional)</label>
                  <textarea id="notes" name="notes" rows="4" placeholder="e.g., I prefer a quiet room on a lower floor..." value={formData.notes} onChange={handleInputChange}></textarea>
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label htmlFor="healthIssues" aria-label="Health Issues or Allergies (Optional)">Health Issues or Allergies (Optional)</label>
                  <textarea id="healthIssues" name="healthIssues" rows="3" placeholder="e.g., Asthma, peanut allergy. This information is kept confidential." value={formData.healthIssues} onChange={handleInputChange}></textarea>
                </div>
              </div>
              </div>
              
              <div className="save-profile-section" style={{background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                  <input type="checkbox" id="saveProfile" checked={true} onChange={() => {}} />
                  <label htmlFor="saveProfile" style={{fontWeight: 600, color: '#1e293b'}}>Save this information to my profile</label>
                </div>
                <p style={{fontSize: '13px', color: '#64748b', margin: 0}}>This will make future bookings faster by auto-filling your details</p>
              </div>
              <div className="terms-agreement">
                <input type="checkbox" id="terms" name="terms" required checked={termsAccepted} onChange={handleTermsChange} />
                <label htmlFor="terms" aria-label="I have read and agree to the Terms and Conditions and the hostel's booking policy.">I have read and agree to the <a href="#">Terms and Conditions</a> and the hostel's booking policy.</label>
              </div>
              <p className="summary-note">
                By proceeding, you agree to our Terms of Service and the hostel's rules and regulations.
              </p>
              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="btn primary book-btn" id="paymentBtn" disabled={!termsAccepted || isLoading}>
                  {isLoading ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              </div>
            </form>
            )}
            
            {currentStep === 3 && (
              <div className="confirmation-wrapper">
                <div className="success-animation">
                  <div className="success-circle">
                    <div className="success-checkmark">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <div className="confetti"></div>
                </div>
                <h2 className="confirmation-title">Payment Successful!</h2>
                <p className="confirmation-subtitle">Your booking has been confirmed</p>
                <div className="confirmation-card">
                  <div className="confirmation-header">
                    <i className="fa-solid fa-receipt"></i>
                    <span>Booking Details</span>
                  </div>
                  <div className="confirmation-details">
                    <div className="detail-row">
                      <span><i className="fa-solid fa-building"></i> Hostel</span>
                      <strong>{hostelName}</strong>
                    </div>
                    <div className="detail-row">
                      <span><i className="fa-solid fa-door-open"></i> Room</span>
                      <strong>{roomName}</strong>
                    </div>
                    <div className="detail-row">
                      <span><i className="fa-solid fa-wallet"></i> Amount Paid</span>
                      <strong className="amount">UGX {totalPrice.toLocaleString()}</strong>
                    </div>
                    <div className="detail-row">
                      <span><i className="fa-solid fa-envelope"></i> Email</span>
                      <strong>{userProfile?.email}</strong>
                    </div>
                  </div>
                </div>
                <div className="confirmation-actions">
                  <button onClick={handleDownloadReceipt} className="btn-receipt" disabled={downloadingReceipt} style={{marginRight: '12px', background: '#10b981', borderColor: '#10b981'}}>
                    {downloadingReceipt ? (
                      <><i className="fa-solid fa-spinner fa-spin"></i> Generating...</>
                    ) : (
                      <><i className="fa-solid fa-download"></i> Download Receipt</>
                    )}
                  </button>
                  <button onClick={() => { window.location.href = '/dashboard'; }} className="btn-dashboard">
                    <i className="fa-solid fa-gauge"></i> Go to Dashboard
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="payment-modern-wrapper">
                <div className="payment-summary-card-modern">
                  <div className="summary-icon-modern"><i className="fa-solid fa-receipt"></i></div>
                  <h3>Summary</h3>
                  <div className="summary-list-modern">
                    <div className="summary-row-compact"><span><i className="fa-solid fa-building"></i> {hostelName}</span></div>
                    <div className="summary-row-compact"><span><i className="fa-solid fa-door-open"></i> {roomName}</span></div>
                    <div className="summary-divider-thin"></div>
                    <div className="summary-row-compact"><span>Room</span><span>UGX {price.toLocaleString()}</span></div>
                    <div className="summary-row-compact"><span>Fee</span><span>UGX {serviceFee.toLocaleString()}</span></div>
                    <div className="summary-total-compact"><span>Total</span><span>UGX {totalPrice.toLocaleString()}</span></div>
                  </div>
                </div>
                <div className="payment-methods-card-modern">
                  <h3>Payment Method</h3>
                  <div className="payment-cards-modern">
                    <div className={`pay-card-modern ${paymentMethod === 'mobile-money' ? 'active' : ''}`} onClick={() => setPaymentMethod('mobile-money')}>
                      <div className="pay-icon-modern"><i className="fa-solid fa-mobile-screen-button"></i></div>
                      <span>Mobile Money</span>
                      <div className="check-modern"><i className="fa-solid fa-circle-check"></i></div>
                    </div>
                    <div className={`pay-card-modern ${paymentMethod === 'credit-card' ? 'active' : ''}`} onClick={() => setPaymentMethod('credit-card')}>
                      <div className="pay-icon-modern"><i className="fa-solid fa-credit-card"></i></div>
                      <span>Card</span>
                      <div className="check-modern"><i className="fa-solid fa-circle-check"></i></div>
                    </div>
                    <div className={`pay-card-modern ${paymentMethod === 'bank-transfer' ? 'active' : ''}`} onClick={() => setPaymentMethod('bank-transfer')}>
                      <div className="pay-icon-modern"><i className="fa-solid fa-building-columns"></i></div>
                      <span>Bank</span>
                      <div className="check-modern"><i className="fa-solid fa-circle-check"></i></div>
                    </div>
                  </div>

                  <div className="payment-form-compact">
                    {paymentMethod === 'mobile-money' && (
                      <input type="tel" placeholder="Phone (e.g., 0771234567)" className="input-compact" value={mobileMoneyPhone} onChange={(e) => setMobileMoneyPhone(e.target.value)} />
                    )}
                    {paymentMethod === 'credit-card' && (
                      <>
                        <input type="text" placeholder="Card number" className="input-compact" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                        <div className="input-row-compact">
                          <input type="text" placeholder="MM/YY" className="input-compact" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                          <input type="text" placeholder="CVC" className="input-compact" value={cardCVC} onChange={(e) => setCardCVC(e.target.value)} />
                        </div>
                      </>
                    )}
                    {paymentMethod === 'bank-transfer' && (
                      <>
                        <div className="bank-box-modern">
                          <p><strong>Stanbic Bank</strong></p>
                          <p>BookMyHostel Ltd</p>
                          <p>9030012345678</p>
                        </div>
                        <div className="file-box-modern">
                          <input type="file" id="proof" className="file-input" accept="image/*,.pdf" onChange={handlePaymentFileUpload} />
                          <label htmlFor="proof" className="file-label-compact"><i className="fa-solid fa-cloud-arrow-up"></i> {paymentFileName}</label>
                        </div>
                      </>
                    )}
                  </div>
                  <button className="pay-button-modern" onClick={handleConfirmPayment} disabled={isLoading}>
                    {isLoading ? (
                      <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</>
                    ) : (
                      <><i className="fa-solid fa-lock"></i> Pay UGX {totalPrice.toLocaleString()}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
      </div>
      
      {/* Active Booking Modal */}
      {showActiveBookingModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '0', borderRadius: '16px', maxWidth: '450px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 30px', borderBottom: '2px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Active Booking Found</h3>
            </div>
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <i className="fa-solid fa-exclamation-circle" style={{ fontSize: '48px', color: '#f59e0b', marginBottom: '20px' }}></i>
              <p style={{ color: '#475569', fontSize: '16px', marginBottom: '16px', lineHeight: '1.6' }}>You already have an active booking. If you just cancelled a booking, please wait a moment and refresh the status.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '20px 30px', borderTop: '2px solid #e2e8f0' }}>
              <button onClick={async () => {
                setShowActiveBookingModal(false);
                // Wait a moment then recheck
                setTimeout(async () => {
                  try {
                    const activeBookings = await bookingService.checkActiveBookings();
                    if (activeBookings.length > 0) {
                      setShowActiveBookingModal(true);
                    }
                  } catch (error) {
                    console.error('Failed to recheck bookings:', error);
                  }
                }, 1000);
              }} style={{ flex: 1, padding: '14px 24px', background: '#10b981', border: 'none', color: 'white', borderRadius: '10px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)' }}>Refresh Status</button>
              <button onClick={() => navigate('/my-bookings')} style={{ flex: 1, padding: '14px 24px', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', border: 'none', color: 'white', borderRadius: '10px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.3)' }}>View My Bookings</button>
            </div>
          </div>
        </div>
      )}
      
      {/* PIN Modal */}
      {showPinModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => !isProcessing && setShowPinModal(false)}>
          <div style={{ background: 'white', padding: '0', borderRadius: '16px', maxWidth: '450px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 30px', borderBottom: '2px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>{isProcessing ? 'Processing Payment' : 'Enter Mobile Money PIN'}</h3>
              {!isProcessing && (
                <button onClick={() => setShowPinModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px' }}>
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
            <div style={{ padding: '30px' }}>
              {!isProcessing ? (
                <>
                  <p style={{ color: '#475569', fontSize: '15px', marginBottom: '16px' }}>Payment will be sent from <strong style={{ color: '#0ea5e9' }}>{mobileMoneyPhone}</strong></p>
                  <p style={{ color: '#475569', fontSize: '15px', marginBottom: '16px' }}>To merchant number: <strong style={{ color: '#0ea5e9' }}>{MERCHANT_NUMBER}</strong></p>
                  <p style={{ color: '#475569', fontSize: '15px', marginBottom: '24px' }}>Amount: <strong style={{ color: '#0ea5e9' }}>UGX {totalPrice.toLocaleString()}</strong></p>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>PIN</label>
                  <input 
                    type="password" 
                    placeholder="Enter 4-digit PIN" 
                    maxLength="4"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoFocus
                    style={{ width: '100%', padding: '14px 18px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div className="spinner"></div>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#0ea5e9', margin: '24px 0 0 0' }}>{paymentStatus}</p>
                </div>
              )}
            </div>
            {!isProcessing && (
              <div style={{ display: 'flex', gap: '12px', padding: '20px 30px', borderTop: '2px solid #e2e8f0' }}>
                <button onClick={() => setShowPinModal(false)} style={{ flex: 1, padding: '14px 24px', background: 'white', border: '2px solid #e2e8f0', color: '#64748b', borderRadius: '10px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handlePinSubmit} style={{ flex: 1, padding: '14px 24px', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', border: 'none', color: 'white', borderRadius: '10px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.3)' }}>Confirm Payment</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default BookingPage;