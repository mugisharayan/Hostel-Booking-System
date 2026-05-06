import React, { useState } from 'react';

const RoomRequestForm = ({ isOpen, onClose }) => {
  const [requestType, setRequestType] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [preferredRoom, setPreferredRoom] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send room request to custodian
    console.log('Room request:', { requestType, currentRoom, preferredRoom, reason });
    alert('Room request sent to custodian!');
    setRequestType('');
    setCurrentRoom('');
    setPreferredRoom('');
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3><i className="fas fa-door-open"></i> Room Request</h3>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Request Type</label>
            <select value={requestType} onChange={(e) => setRequestType(e.target.value)} required>
              <option value="">Select request type</option>
              <option value="change">Room Change</option>
              <option value="assignment">Room Assignment</option>
              <option value="roommate">Roommate Issue</option>
              <option value="upgrade">Room Upgrade</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Current Room</label>
              <input
                type="text"
                value={currentRoom}
                onChange={(e) => setCurrentRoom(e.target.value)}
                placeholder="e.g., A-105"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Preferred Room (if applicable)</label>
              <input
                type="text"
                value={preferredRoom}
                onChange={(e) => setPreferredRoom(e.target.value)}
                placeholder="e.g., B-210"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Reason for Request</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain your reason for this request..."
              rows="4"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn secondary">Cancel</button>
            <button type="submit" className="btn primary">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomRequestForm;