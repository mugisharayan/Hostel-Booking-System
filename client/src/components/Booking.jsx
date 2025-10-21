import React, { useState } from 'react';
import './Booking.css';
import './bookingform.css';

const Booking = () => {
  const [form, setForm] = useState({
    fullName: '',
    college: '',
    studentNumber: '',
    phone: '',
    kinName: '',
    kinPhone: '',
    kinEmail: '',
    kinRelationship: '',
    medical: 'no',
    medicalDetails: '',
    consent: false,
    documents: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setForm(prev => ({ ...prev, documents: files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submit', form);
    alert('Booking submitted (demo).');
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1 className="booking-title">Hostel Booking Form</h1>
        <form className="booking-form" onSubmit={handleSubmit}>
          <fieldset className="personal-info">
            <legend>Personal Information</legend>
            <div className="personal-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="fullName" value={form.fullName} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">College Name</label>
                <input className="form-input" name="college" value={form.college} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Student Number</label>
                <input className="form-input" name="studentNumber" value={form.studentNumber} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" name="phone" value={form.phone} onChange={handleChange} />
              </div>
            </div>
          </fieldset>

          <fieldset className="personal-info">
            <legend>Next Of Kin Information</legend>
            <div className="personal-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="kinName" value={form.kinName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" name="kinPhone" value={form.kinPhone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" name="kinEmail" value={form.kinEmail} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Relationship</label>
                <input className="form-input" name="kinRelationship" value={form.kinRelationship} onChange={handleChange} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Health Status</legend>
            <div className="radio-row">
              <label><input type="radio" name="medical" value="yes" checked={form.medical==='yes'} onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="medical" value="no" checked={form.medical==='no'} onChange={handleChange} /> No</label>
            </div>
            {form.medical === 'yes' && (
              <label className="medical-details">If yes, give details<textarea name="medicalDetails" value={form.medicalDetails} onChange={handleChange}></textarea></label>
            )}
          </fieldset>

          <fieldset>
            <legend>Document Upload (PDF)</legend>
            <input type="file" accept="application/pdf" multiple onChange={handleFile} />
            <div className="doc-note">Upload Student ID, Payment Receipt, University Admission and Medical Form</div>
          </fieldset>

          <div className="consent-row">
            <label><input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} /> I agree to all hostel rules and regulations.</label>
          </div>

          <div className="booking-actions">
            <button type="button" className="btn btn-cancel" onClick={() => window.history.back()}>Cancel</button>
            <button type="submit" className="btn btn-submit">Submit Booking</button>
          </div>
        </form>
      </div>

      <aside className="booking-aside">
        <div className="hostel-card">
          <div className="hostel-image-placeholder">Image</div>
          <h3>Hostel Name</h3>
          <p><strong>Fees:</strong> UGX 800,000 / semester</p>
          <p><strong>Location:</strong> Lumumba St, Kampala</p>
          <div className="ratings">Ratings: ★★★★☆</div>
          <div className="payment-action">
            <a href="/payment" className="btn btn-make-payment">Make Payments</a>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Booking;
