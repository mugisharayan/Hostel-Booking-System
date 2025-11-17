import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

// Constants
const TEXTS = {
  TITLE: 'Confirm Logout',
  MESSAGE: 'Are you sure you want to log out?',
  CANCEL: 'Cancel',
  CONFIRM: 'Logout'
};

// Helper functions
const handleOverlayClick = (event, onClose) => {
  if (event.target.className.includes('confirm-modal-overlay')) {
    onClose();
  }
};

// Components
const ModalHeader = () => (
  <h3>{TEXTS.TITLE}</h3>
);

const ModalMessage = () => (
  <p className="muted">{TEXTS.MESSAGE}</p>
);

const ModalActions = ({ onClose, onConfirm }) => (
  <div className="confirm-modal-actions">
    <button className="btn outline" onClick={onClose}>
      {TEXTS.CANCEL}
    </button>
    <button className="btn primary" onClick={onConfirm}>
      {TEXTS.CONFIRM}
    </button>
  </div>
);

ModalActions.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const handleOverlayClickWrapper = useCallback((event) => {
    handleOverlayClick(event, onClose);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay is-visible" onClick={handleOverlayClickWrapper}>
      <div className="confirm-modal-content">
        <ModalHeader />
        <ModalMessage />
        <ModalActions onClose={onClose} onConfirm={onConfirm} />
      </div>
    </div>
  );
};

LogoutConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default LogoutConfirmModal;