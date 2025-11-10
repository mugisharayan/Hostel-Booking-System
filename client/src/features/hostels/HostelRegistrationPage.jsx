import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import '../../styles/modern-dashboard.css';
import '../../styles/custodian-modern.css';
import '../../styles/hostel-registration.css';

const HostelRegistrationPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    images: [],
    amenities: [],
    priceRange: '',
    rating: 4.5,
    reviews: 0
  });

  const custodianProfile = {
    fullName: 'John K.',
    course: 'Lead Custodian',
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  const availableAmenities = [
    'WiFi', 'Parking', 'Security', 'Kitchen', 'Laundry', 'Study Room', 'Gym', 'Generator'
  ];

  const locations = [
    'Kikoni', 'Wandegeya', 'Kikumi Kikumi', 'Mulago', 'LDC'
  ];

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    
    if (formData.images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, event.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Hostel name is required';
      if (!formData.location) newErrors.location = 'Location is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
      if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    }
    
    if (step === 2) {
      if (formData.images.length === 0) newErrors.images = 'At least 1 image is required';
    }
    
    if (step === 4) {
      if (!formData.priceRange.trim()) newErrors.priceRange = 'Price range is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep(4)) return;
    
    setLoading(true);
    
    setTimeout(() => {
      // Create hostel data
      const hostelData = {
        id: Date.now(),
        name: formData.name,
        location: formData.location,
        description: formData.description,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        images: formData.images,
        amenities: formData.amenities.map(amenity => ({ name: amenity })),
        priceRange: formData.priceRange,
        rating: 4.5,
        reviews: 0,
        rooms: [],
        createdAt: new Date().toISOString()
      };
      
      // Get existing hostels from localStorage
      const existingHostels = JSON.parse(localStorage.getItem('hostels') || '[]');
      
      // Add new hostel
      const updatedHostels = [...existingHostels, hostelData];
      localStorage.setItem('hostels', JSON.stringify(updatedHostels));
      
      setLoading(false);
      alert('Hostel registered successfully!');
      navigate('/hostels');
    }, 500);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Hostel Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter hostel name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label>Location *</label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={errors.location ? 'error' : ''}
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors.location && <span className="error-text">{errors.location}</span>}
              </div>
              
              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your hostel"
                  rows="4"
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>
              
              <div className="form-group">
                <label>Contact Email *</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="contact@hostel.com"
                  className={errors.contactEmail ? 'error' : ''}
                />
                {errors.contactEmail && <span className="error-text">{errors.contactEmail}</span>}
              </div>
              
              <div className="form-group">
                <label>Contact Phone *</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+256 700 123 456"
                  className={errors.contactPhone ? 'error' : ''}
                />
                {errors.contactPhone && <span className="error-text">{errors.contactPhone}</span>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h3>Upload Images (Maximum 5 images)</h3>
            <div className="image-upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="image-upload"
                  style={{ display: 'none' }}
                  disabled={formData.images.length >= 5}
                />
                <label htmlFor="image-upload" className={`upload-label ${formData.images.length >= 5 ? 'disabled' : ''}`}>
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{formData.images.length >= 5 ? 'Maximum images reached' : 'Click to upload images'}</span>
                  <small>Upload up to 5 images of your hostel ({formData.images.length}/5)</small>
                </label>
              </div>
              
              {formData.images.length > 0 && (
                <div className="image-preview-grid">
                  {formData.images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.images && <span className="error-text">{errors.images}</span>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h3>Amenities & Features</h3>
            <div className="amenities-grid">
              {availableAmenities.map(amenity => (
                <div
                  key={amenity}
                  className={`amenity-item ${formData.amenities.includes(amenity) ? 'selected' : ''}`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  <i className="fas fa-check"></i>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <h3>Pricing Information</h3>
            <div className="form-group">
              <label>Price Range *</label>
              <input
                type="text"
                value={formData.priceRange}
                onChange={(e) => handleInputChange('priceRange', e.target.value)}
                placeholder="e.g., $300 - $500"
                className={errors.priceRange ? 'error' : ''}
              />
              {errors.priceRange && <span className="error-text">{errors.priceRange}</span>}
            </div>
            
            <div className="summary-section">
              <h4>Registration Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <strong>Hostel Name:</strong> {formData.name}
                </div>
                <div className="summary-item">
                  <strong>Location:</strong> {formData.location}
                </div>
                <div className="summary-item">
                  <strong>Images:</strong> {formData.images.length} uploaded
                </div>
                <div className="summary-item">
                  <strong>Amenities:</strong> {formData.amenities.length} selected
                </div>
                <div className="summary-item">
                  <strong>Price Range:</strong> {formData.priceRange}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <section className="custodian-hero sky-blue-theme">
        <div className="floating-icons">
          <i className="fa-solid fa-building floating-icon-1"></i>
          <i className="fa-solid fa-home floating-icon-2"></i>
          <i className="fa-solid fa-key floating-icon-3"></i>
          <i className="fa-solid fa-users floating-icon-4"></i>
          <i className="fa-solid fa-star floating-icon-5"></i>
          <i className="fa-solid fa-map-marker-alt floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>Hostel <span className="dashboard-animated">Registration</span></h1>
          <p>Register your hostel and start welcoming students</p>
        </div>
      </section>
      
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-layout">
            <DashboardSidebar
              user={custodianProfile}
              role="custodian"
              onLogout={() => setIsLogoutModalOpen(true)}
            />
            <div className="dashboard-content">
              <div className="modern-dashboard-container sky-blue-theme">
                <div className="progress-bar">
                  <div className="progress-steps">
                    {[1, 2, 3, 4].map(step => (
                      <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
                        <div className="step-number">{step}</div>
                        <div className="step-label">
                          {step === 1 && 'Basic Info'}
                          {step === 2 && 'Images'}
                          {step === 3 && 'Amenities'}
                          {step === 4 && 'Pricing'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="progress-line">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="registration-form">
                  {renderStep()}
                  
                  <div className="form-navigation">
                    {currentStep > 1 && (
                      <button type="button" onClick={prevStep} className="btn secondary">
                        <i className="fas fa-arrow-left"></i> Previous
                      </button>
                    )}
                    {currentStep < 4 ? (
                      <button type="button" onClick={nextStep} className="btn primary">
                        Next <i className="fas fa-arrow-right"></i>
                      </button>
                    ) : (
                      <button type="button" onClick={handleSubmit} disabled={loading} className="btn primary">
                        {loading ? (
                          <><i className="fas fa-spinner fa-spin"></i> Registering...</>
                        ) : (
                          <><i className="fas fa-check"></i> Register Hostel</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default HostelRegistrationPage;