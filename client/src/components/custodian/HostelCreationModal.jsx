import React, { useState } from 'react';
import { useCustodian } from '../../contexts/CustodianContext';

const HostelCreationModal = ({ isOpen, onClose, onSuccess }) => {
  const { createHostel, loading } = useCustodian();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    contact: '',
    priceRange: { min: '', max: '' },
    amenities: [],
    rooms: [],
    images: [],
    totalRooms: '',
    rating: 4.0,
    isActive: true
  });
  const [error, setError] = useState('');
  const [currentAmenity, setCurrentAmenity] = useState('');
  const [currentRoom, setCurrentRoom] = useState({ name: '', price: '', description: '', capacity: '' });
  const [imageUrls, setImageUrls] = useState(['']);

  const amenityOptions = [
    { name: 'WiFi', icon: 'fa-wifi' },
    { name: 'Parking', icon: 'fa-car' },
    { name: 'Kitchen', icon: 'fa-utensils' },
    { name: 'Laundry', icon: 'fa-tshirt' },
    { name: 'Security', icon: 'fa-shield-alt' },
    { name: 'Study Room', icon: 'fa-book' },
    { name: 'Common Area', icon: 'fa-users' },
    { name: 'Air Conditioning', icon: 'fa-snowflake' },
    { name: 'Hot Water', icon: 'fa-fire' },
    { name: 'Cleaning Service', icon: 'fa-broom' },
    { name: 'CCTV', icon: 'fa-video' },
    { name: 'Generator', icon: 'fa-bolt' },
    { name: 'Gym', icon: 'fa-dumbbell' },
    { name: 'Restaurant', icon: 'fa-utensils' },
    { name: 'Balcony', icon: 'fa-home' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addAmenity = () => {
    if (currentAmenity && !formData.amenities.find(a => a.name === currentAmenity.name)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, currentAmenity]
      }));
      setCurrentAmenity('');
    }
  };

  const removeAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a.name !== amenity.name)
    }));
  };

  const addRoom = () => {
    if (currentRoom.name && currentRoom.price && currentRoom.capacity) {
      const roomIcons = {
        'Single': 'fa-bed',
        'Double': 'fa-bed',
        'Triple': 'fa-bed',
        'Shared': 'fa-users',
        'Private': 'fa-user',
        'Studio': 'fa-home'
      };
      
      setFormData(prev => ({
        ...prev,
        rooms: [...prev.rooms, { 
          ...currentRoom, 
          price: Number(currentRoom.price),
          capacity: Number(currentRoom.capacity),
          icon: roomIcons[currentRoom.name] || 'fa-bed'
        }]
      }));
      setCurrentRoom({ name: '', price: '', description: '', capacity: '' });
    }
  };

  const removeRoom = (index) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index)
    }));
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageUrl = (index, url) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
    setFormData(prev => ({
      ...prev,
      images: newUrls.filter(url => url.trim() !== '')
    }));
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setFormData(prev => ({
      ...prev,
      images: newUrls.filter(url => url.trim() !== '')
    }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.location || !formData.description || !formData.contact) {
        setError('Please fill in all basic information fields');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.priceRange.min || !formData.priceRange.max || !formData.totalRooms) {
        setError('Please complete pricing and room information');
        return;
      }
    }
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.amenities.length === 0) {
      setError('Please add at least one amenity');
      return;
    }

    if (formData.rooms.length === 0) {
      setError('Please add at least one room type');
      return;
    }

    try {
      const hostelData = {
        ...formData,
        priceRange: {
          min: Number(formData.priceRange.min),
          max: Number(formData.priceRange.max)
        },
        totalRooms: Number(formData.totalRooms)
      };

      console.log('Creating hostel with data:', hostelData);
      const result = await createHostel(hostelData);
      console.log('Hostel created successfully:', result);
      
      // Show success message
      alert('🎉 Hostel created successfully! Your hostel is now live and visible to students.');
      
      // Reset form
      setFormData({
        name: '',
        location: '',
        description: '',
        contact: '',
        priceRange: { min: '', max: '' },
        amenities: [],
        rooms: [],
        images: [],
        totalRooms: '',
        rating: 4.0,
        isActive: true
      });
      setCurrentStep(1);
      
      onSuccess(result);
      onClose();
    } catch (err) {
      console.error('Failed to create hostel:', err);
      setError(err.message || 'Failed to create hostel. Please try again.');
    }
  };

  if (!isOpen) return null;

  const renderStep1 = () => (
    <div>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
        Basic Information
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Hostel Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter hostel name"
            required
            style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Kikoni, Kampala"
            required
            style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
          Contact Number *
        </label>
        <input
          type="tel"
          name="contact"
          value={formData.contact}
          onChange={handleInputChange}
          placeholder="e.g., +256 700 000 000"
          required
          style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe your hostel, facilities, and what makes it special..."
          rows="4"
          required
          style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
        Pricing & Capacity
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Minimum Price (UGX) *
          </label>
          <input
            type="number"
            name="priceRange.min"
            value={formData.priceRange.min}
            onChange={handleInputChange}
            placeholder="300000"
            required
            style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Maximum Price (UGX) *
          </label>
          <input
            type="number"
            name="priceRange.max"
            value={formData.priceRange.max}
            onChange={handleInputChange}
            placeholder="800000"
            required
            style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Total Rooms *
          </label>
          <input
            type="number"
            name="totalRooms"
            value={formData.totalRooms}
            onChange={handleInputChange}
            placeholder="50"
            required
            style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '20px 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
          Room Types
        </h4>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <select
              value={currentRoom.name}
              onChange={(e) => setCurrentRoom(prev => ({ ...prev, name: e.target.value }))}
              style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            >
              <option value="">Select room type</option>
              <option value="Single">Single Room</option>
              <option value="Double">Double Room</option>
              <option value="Triple">Triple Room</option>
              <option value="Shared">Shared Room</option>
              <option value="Private">Private Room</option>
              <option value="Studio">Studio</option>
            </select>
            <input
              type="number"
              value={currentRoom.price}
              onChange={(e) => setCurrentRoom(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Price (UGX)"
              style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            />
            <input
              type="number"
              value={currentRoom.capacity}
              onChange={(e) => setCurrentRoom(prev => ({ ...prev, capacity: e.target.value }))}
              placeholder="Capacity"
              style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <input
            type="text"
            value={currentRoom.description}
            onChange={(e) => setCurrentRoom(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Room description"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', marginBottom: '12px' }}
          />
          <button
            type="button"
            onClick={addRoom}
            style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
          >
            Add Room Type
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {formData.rooms.map((room, index) => (
            <div key={index} style={{ backgroundColor: '#e0f2fe', padding: '8px 12px', borderRadius: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{room.name} - UGX {room.price.toLocaleString()} ({room.capacity} person{room.capacity > 1 ? 's' : ''})</span>
              <button
                type="button"
                onClick={() => removeRoom(index)}
                style={{ background: 'none', border: 'none', color: '#0369a1', cursor: 'pointer', fontSize: '16px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
        Amenities & Photos
      </h3>
      
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
          Amenities
        </h4>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <select
              value={currentAmenity ? currentAmenity.name : ''}
              onChange={(e) => {
                const selected = amenityOptions.find(a => a.name === e.target.value);
                setCurrentAmenity(selected || '');
              }}
              style={{ flex: 1, padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            >
              <option value="">Select amenity</option>
              {amenityOptions.map(amenity => (
                <option key={amenity.name} value={amenity.name}>{amenity.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addAmenity}
              style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
            >
              Add
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {formData.amenities.map((amenity, index) => (
            <div key={index} style={{ backgroundColor: '#dcfce7', padding: '8px 12px', borderRadius: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className={`fas ${amenity.icon}`} style={{ color: '#16a34a' }}></i>
              <span>{amenity.name}</span>
              <button
                type="button"
                onClick={() => removeAmenity(amenity)}
                style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontSize: '16px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
          Photos (URLs)
        </h4>
        
        {imageUrls.map((url, index) => (
          <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <input
              type="url"
              value={url}
              onChange={(e) => updateImageUrl(index, e.target.value)}
              placeholder="Enter image URL"
              style={{ flex: 1, padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            />
            {imageUrls.length > 1 && (
              <button
                type="button"
                onClick={() => removeImageUrl(index)}
                style={{ padding: '10px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={addImageUrl}
          style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
        >
          Add Another Photo
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>
              Create Your Hostel
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Step {currentStep} of 3 - {currentStep === 1 ? 'Basic Information' : currentStep === 2 ? 'Pricing & Rooms' : 'Amenities & Photos'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#9ca3af',
              padding: '8px',
              borderRadius: '8px'
            }}
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ padding: '0 32px 24px' }}>
          <div style={{ backgroundColor: '#f3f4f6', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              backgroundColor: '#3b82f6',
              height: '100%',
              width: `${(currentStep / 3) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '0 32px 32px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
            marginTop: '24px'
          }}>
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    padding: '12px 24px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Previous
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: loading ? '#9ca3af' : '#10b981',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Creating...' : 'Create Hostel'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostelCreationModal;