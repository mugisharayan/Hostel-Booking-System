import React from 'react';
import './RoomAssignmentNotification.css';

const RoomAssignmentNotification = ({ notification, onClose, onShare }) => {
  const { studentName, roomNumber, hostelName, accessCode } = notification.data;

  const handleShare = () => {
    if (onShare) {
      onShare({
        studentName,
        roomNumber,
        hostelName,
        accessCode
      });
    }
    onClose();
  };

  return (
    <div className="room-assignment-success">
      <div className="success-header">
        <div className="success-icon">✅</div>
        <h3>Room Assigned Successfully!</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="success-content">
        <p><strong>{studentName}</strong> has been assigned to <strong>Room {roomNumber}</strong> in <strong>{hostelName}</strong></p>
        
        <div className="secret-code-section">
          <h4>🔐 Secret Access Code</h4>
          <div className="secret-code-display">
            <span className="secret-code">{accessCode}</span>
          </div>
        </div>
        
        <button className="share-btn" onClick={handleShare}>
          📤 Share with Student
        </button>
      </div>
    </div>
  );
};

export default RoomAssignmentNotification;