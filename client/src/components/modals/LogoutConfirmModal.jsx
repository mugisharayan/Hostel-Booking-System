import React from 'react';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay is-visible" onClick={(e) => e.target.className.includes('confirm-modal-overlay') && onClose()}>
      <div className="confirm-modal-content">
        <h3>Confirm Logout</h3>
        <p className="muted">Are you sure you want to log out?</p>
        <div className="confirm-modal-actions">
          <button className="btn outline" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;