import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// Constants
const STYLES = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)'
  },
  modal: {
    background: 'white',
    padding: '0',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 30px',
    borderBottom: '2px solid #e2e8f0'
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e293b'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#64748b',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    borderRadius: '8px'
  },
  content: {
    padding: '30px'
  },
  warning: {
    background: '#fef3c7',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #fbbf24'
  },
  warningHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  warningIcon: {
    color: '#f59e0b'
  },
  warningTitle: {
    color: '#92400e'
  },
  warningText: {
    margin: 0,
    fontSize: '14px',
    color: '#92400e'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '8px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  actions: {
    display: 'flex',
    gap: '12px'
  },
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    background: 'white',
    border: '2px solid #e2e8f0',
    color: '#64748b',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  submitButton: {
    flex: 1,
    padding: '12px 24px',
    background: '#ef4444',
    border: 'none',
    color: 'white',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

const TEXTS = {
  TITLE: 'Cancel Booking',
  WARNING_TITLE: 'Booking Cancellation',
  WARNING_MESSAGE: 'You are about to cancel your booking for',
  LABEL: 'Reason for cancellation *',
  PLACEHOLDER: 'Please provide a reason for cancelling your booking...',
  KEEP_BOOKING: 'Keep Booking',
  CANCEL_BOOKING: 'Cancel Booking',
  CANCELLING: 'Cancelling...'
};

// Helper functions
const handleOverlayClick = (event, onClose) => {
  if (event.target === event.currentTarget) {
    onClose();
  }
};

const stopPropagation = (event) => {
  event.stopPropagation();
};

const getSubmitButtonStyle = (isDisabled) => ({
  ...STYLES.submitButton,
  opacity: isDisabled ? 0.5 : 1
});

const formatBookingDetails = (bookingDetails) => {
  if (!bookingDetails) return '';
  return `${bookingDetails.hostel} - ${bookingDetails.room}`;
};

// Components
const ModalHeader = ({ onClose }) => (
  <div style={STYLES.header}>
    <h3 style={STYLES.title}>{TEXTS.TITLE}</h3>
    <button onClick={onClose} style={STYLES.closeButton}>
      <i className="fa-solid fa-times"></i>
    </button>
  </div>
);

ModalHeader.propTypes = {
  onClose: PropTypes.func.isRequired
};

const WarningSection = ({ bookingDetails }) => (
  <div style={STYLES.warning}>
    <div style={STYLES.warningHeader}>
      <i className="fa-solid fa-exclamation-triangle" style={STYLES.warningIcon}></i>
      <strong style={STYLES.warningTitle}>{TEXTS.WARNING_TITLE}</strong>
    </div>
    <p style={STYLES.warningText}>
      {TEXTS.WARNING_MESSAGE} <strong>{formatBookingDetails(bookingDetails)}</strong>
    </p>
  </div>
);

WarningSection.propTypes = {
  bookingDetails: PropTypes.shape({
    hostel: PropTypes.string,
    room: PropTypes.string
  })
};

const ReasonInput = ({ reason, onChange }) => (
  <div style={STYLES.formGroup}>
    <label style={STYLES.label}>
      {TEXTS.LABEL}
    </label>
    <textarea
      value={reason}
      onChange={onChange}
      placeholder={TEXTS.PLACEHOLDER}
      required
      rows="4"
      style={STYLES.textarea}
    />
  </div>
);

ReasonInput.propTypes = {
  reason: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

const ActionButtons = ({ onClose, isSubmitting, isDisabled }) => (
  <div style={STYLES.actions}>
    <button 
      type="button" 
      onClick={onClose} 
      style={STYLES.cancelButton}
    >
      {TEXTS.KEEP_BOOKING}
    </button>
    <button 
      type="submit" 
      disabled={isDisabled}
      style={getSubmitButtonStyle(isDisabled)}
    >
      {isSubmitting ? (
        <><i className="fa-solid fa-spinner fa-spin"></i> {TEXTS.CANCELLING}</>
      ) : (
        TEXTS.CANCEL_BOOKING
      )}
    </button>
  </div>
);

ActionButtons.propTypes = {
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired
};

const CancelBookingModal = ({ isOpen, onClose, onConfirm, bookingDetails }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReasonChange = useCallback((e) => {
    setReason(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Cancellation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [reason, onConfirm, onClose]);

  const handleOverlayClickWrapper = useCallback((event) => {
    handleOverlayClick(event, onClose);
  }, [onClose]);

  if (!isOpen) return null;

  const isDisabled = !reason.trim() || isSubmitting;

  return (
    <div style={STYLES.overlay} onClick={handleOverlayClickWrapper}>
      <div style={STYLES.modal} onClick={stopPropagation}>
        <ModalHeader onClose={onClose} />
        
        <div style={STYLES.content}>
          <WarningSection bookingDetails={bookingDetails} />
          
          <form onSubmit={handleSubmit}>
            <ReasonInput reason={reason} onChange={handleReasonChange} />
            <ActionButtons 
              onClose={onClose}
              isSubmitting={isSubmitting}
              isDisabled={isDisabled}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

CancelBookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  bookingDetails: PropTypes.shape({
    hostel: PropTypes.string,
    room: PropTypes.string
  })
};

export default CancelBookingModal;