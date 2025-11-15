import React, { useState } from 'react';
import { useCustodian } from '../../contexts/CustodianContext';

const HostelLinkingModal = ({ isOpen, onClose, onSuccess }) => {
  const [hostelName, setHostelName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { linkToHostel, loading, error } = useCustodian();

  // Common hostel names for suggestions
  const commonHostels = [
    'Lyn Modern Hostel',
    'Muhika Hostel',
    'Olympia Hostel', 
    'Akamwesi Hostel',
    'Nsibirwa Hostel',
    'Kikoni Hostel',
    'Wandegeya Hostel'
  ];

  const handleInputChange = (value) => {
    setHostelName(value);
    if (value.length > 0) {
      const filtered = commonHostels.filter(hostel => 
        hostel.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hostelName.trim()) return;

    try {
      // Store hostel link data
      const hostelData = {
        name: hostelName.trim(),
        id: hostelName.toLowerCase().replace(/\s+/g, '-'),
        linkedAt: new Date().toISOString()
      };
      
      localStorage.setItem('linkedHostel', JSON.stringify(hostelData));
      onSuccess(hostelData);
      onClose();
    } catch (err) {
      console.error('Failed to link hostel:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3><i className="fas fa-link"></i> Link to Existing Hostel</h3>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Hostel Name</label>
            <input
              type="text"
              value={hostelName}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter hostel name (e.g., Lyn Modern Hostel)"
              required
              autoFocus
            />
            {suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      setHostelName(suggestion);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '20px' }}>
              <i className="fas fa-exclamation-triangle"></i> {error}
            </div>
          )}

          <div className="info-box" style={{ marginBottom: '20px', padding: '15px', background: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px' }}>
            <i className="fas fa-info-circle" style={{ color: '#0ea5e9', marginRight: '8px' }}></i>
            <span style={{ fontSize: '14px', color: '#0369a1' }}>
              Linking will import all existing data including bookings, payments, and analytics from the database.
            </span>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn secondary">Cancel</button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Linking...</>
              ) : (
                <><i className="fas fa-link"></i> Link Hostel</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostelLinkingModal;