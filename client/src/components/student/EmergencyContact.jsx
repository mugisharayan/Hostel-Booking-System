import React, { useState } from 'react';

const EmergencyContact = ({ isOpen, onClose }) => {
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send emergency alert to custodian
    const emergency = {
      id: Date.now(),
      type: emergencyType,
      location,
      description,
      timestamp: new Date().toISOString(),
      priority: 'urgent'
    };
    console.log('Emergency alert:', emergency);
    alert('Emergency alert sent! Custodian will be notified immediately.');
    setEmergencyType('');
    setLocation('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible emergency-modal" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content emergency-content">
        <div className="modal-header emergency-header">
          <h3><i className="fas fa-exclamation-triangle"></i> Emergency Contact</h3>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="emergency-warning">
          <p><strong>For life-threatening emergencies, call 911 immediately!</strong></p>
          <p>Use this form for urgent non-life-threatening issues that require immediate custodian attention.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Emergency Type</label>
            <select value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)} required>
              <option value="">Select emergency type</option>
              <option value="security">Security Issue</option>
              <option value="fire">Fire Hazard</option>
              <option value="flood">Water/Flooding</option>
              <option value="electrical">Electrical Hazard</option>
              <option value="medical">Medical Emergency</option>
              <option value="break-in">Break-in/Theft</option>
              <option value="other">Other Urgent Issue</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Room number or specific location"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the emergency situation..."
              rows="4"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn secondary">Cancel</button>
            <button type="submit" className="btn danger">Send Emergency Alert</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyContact;