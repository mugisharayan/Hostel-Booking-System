import React, { useState } from 'react';

const CancelBookingModal = ({ isOpen, onClose, onConfirm, bookingDetails }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
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
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: 'white', padding: '0', borderRadius: '16px', maxWidth: '500px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 30px', borderBottom: '2px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Cancel Booking</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px' }}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div style={{ padding: '30px' }}>
          <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fbbf24' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <i className="fa-solid fa-exclamation-triangle" style={{ color: '#f59e0b' }}></i>
              <strong style={{ color: '#92400e' }}>Booking Cancellation</strong>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
              You are about to cancel your booking for <strong>{bookingDetails?.hostel}</strong> - {bookingDetails?.room}
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                Reason for cancellation *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for cancelling your booking..."
                required
                rows="4"
                style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                onClick={onClose} 
                style={{ flex: 1, padding: '12px 24px', background: 'white', border: '2px solid #e2e8f0', color: '#64748b', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Keep Booking
              </button>
              <button 
                type="submit" 
                disabled={!reason.trim() || isSubmitting}
                style={{ flex: 1, padding: '12px 24px', background: '#ef4444', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: (!reason.trim() || isSubmitting) ? 0.5 : 1 }}
              >
                {isSubmitting ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Cancelling...</>
                ) : (
                  'Cancel Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;