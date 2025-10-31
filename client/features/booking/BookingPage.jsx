import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hostelName = searchParams.get('hostel');
  const roomName = searchParams.get('room');
  const roomPrice = searchParams.get('price');
  const hostelImage = searchParams.get('image');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    course: '',
    yearOfStudy: '',
    studentNumber: '',
    residence: '',
    nextOfKinName: '',
    nextOfKinContact: '',
    guardianName: '',
    guardianContact: '',
    notes: '',
    healthIssues: '',
    studentIdUpload: null,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
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

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    // In a real app, you'd validate the form data here
    if (!termsAccepted) {
      // showToast('Please accept the terms and conditions.');
      return;
    }

    // Construct URL for payment page with all form data
    const paymentParams = new URLSearchParams(searchParams);
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined && key !== 'studentIdUpload') {
        paymentParams.set(key, formData[key]);
      }
    }
    // For file upload, you'd typically upload it to a server and pass a URL/ID
    // For this demo, we'll just ignore the file for the URL params

    navigate(`/payment?${paymentParams.toString()}`);
  };

  return (
    <main className="booking-page">
      <div className="container">
        <div className="booking-page-header">
          <button onClick={() => navigate(-1)} className="back-link"><i className="fa-solid fa-arrow-left"></i> Back to Hostel</button>
          <h1>Complete Your Booking</h1>
          <p>Please fill in your details to secure your room. This should only take a few minutes.</p>
        </div>

        <div className="booking-layout">
          {/* Left Column: Form */}
          <div className="booking-form-col">
            <form className="booking-form" onSubmit={handleProceedToPayment}>
              <div className="form-section">
                <h3>1. Personal Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" name="fullName" placeholder="e.g., Jane Doe" required value={formData.fullName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="e.g., jane.doe@student.mak.ac.ug" required value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Telephone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="e.g., 0771234567" required value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" name="gender" required value={formData.gender} onChange={handleInputChange}>
                      <option value="" disabled>Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" required value={formData.dob} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>2. Academic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="course">Course / Program</label>
                    <input type="text" id="course" name="course" placeholder="e.g., Bachelor of Computer Science" required value={formData.course} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="yearOfStudy">Year of Study</label>
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
                    <label htmlFor="studentNumber">Student Number</label>
                    <input type="text" id="studentNumber" name="studentNumber" placeholder="e.g., 2100712345" required value={formData.studentNumber} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label htmlFor="studentIdUpload">Upload University ID or Admission Letter</label>
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

              <div className="form-section">
                <h3>3. Contact & Emergency Details</h3>
                <div className="form-group">
                  <label htmlFor="residence">Place of Residence</label>
                  <input type="text" id="residence" name="residence" placeholder="e.g., Mbarara, Uganda" required value={formData.residence} onChange={handleInputChange} />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nextOfKinName">Next of Kin's Name</label>
                    <input type="text" id="nextOfKinName" name="nextOfKinName" required value={formData.nextOfKinName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nextOfKinContact">Next of Kin's Contact</label>
                    <input type="tel" id="nextOfKinContact" name="nextOfKinContact" required value={formData.nextOfKinContact} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="guardianName">Parent/Guardian's Name</label>
                    <input type="text" id="guardianName" name="guardianName" required value={formData.guardianName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="guardianContact">Parent/Guardian's Contact</label>
                    <input type="tel" id="guardianContact" name="guardianContact" required value={formData.guardianContact} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>4. Additional Information</h3>
                <div className="form-group">
                  <label htmlFor="notes">Additional Notes or Special Requests (Optional)</label>
                  <textarea id="notes" name="notes" rows="4" placeholder="e.g., I prefer a quiet room on a lower floor..." value={formData.notes} onChange={handleInputChange}></textarea>
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label htmlFor="healthIssues">Health Issues or Allergies (Optional)</label>
                  <textarea id="healthIssues" name="healthIssues" rows="3" placeholder="e.g., Asthma, peanut allergy. This information is kept confidential." value={formData.healthIssues} onChange={handleInputChange}></textarea>
                </div>
              </div>
              <div className="terms-agreement">
                <input type="checkbox" id="terms" name="terms" required checked={termsAccepted} onChange={handleTermsChange} />
                <label htmlFor="terms">I have read and agree to the <a href="#">Terms and Conditions</a> and the hostel's booking policy.</label>
              </div>
              <p className="summary-note">
                By proceeding, you agree to our Terms of Service and the hostel's rules and regulations.
              </p>
              <button type="submit" className="btn primary full-width book-btn" id="paymentBtn" disabled={!termsAccepted}>Proceed to Payment</button>
            </form>
          </div>

          {/* Right Column: Summary */}
          <div className="booking-summary-col">
            <div className="summary-card">
              <div className="summary-hostel-image" id="summaryHostelImage">
                <img src={hostelImage || 'https://via.placeholder.com/300x200.png?text=Hostel+Image'} alt="Selected hostel image" />
              </div>
              <h3>Booking Summary</h3>
              <div className="summary-item" id="summaryHostel">
                <small>Hostel</small>
                <span>{hostelName || 'N/A'}</span>
              </div>
              <div className="summary-item" id="summaryRoom">
                <small>Room Type</small>
                <span>{roomName || 'N/A'}</span>
              </div>
              <div className="summary-item total" id="summaryPrice">
                <small>Total Price</small>
                <span>UGX {parseInt(roomPrice || 0).toLocaleString()} <small>/ semester</small></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingPage;