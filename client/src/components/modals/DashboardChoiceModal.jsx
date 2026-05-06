import React from 'react';
import { Link } from 'react-router-dom';

const DashboardChoiceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content confirm-modal-content animate-on-scroll">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        <h3>Choose Your Dashboard</h3>
        <p className="muted">Please select which dashboard you would like to view.</p>
        <div className="dashboard-choice-actions">
          <Link to="/dashboard" className="btn primary" onClick={onClose}>
            <i className="fa-solid fa-user-graduate"></i>
            <span>Student Dashboard</span>
          </Link>
          <Link to="/custodian-dashboard" className="btn outline" onClick={onClose}>
            <i className="fa-solid fa-user-shield"></i>
            <span>Custodian Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardChoiceModal;