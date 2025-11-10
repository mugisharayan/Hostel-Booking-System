import React, { useState, useEffect } from 'react';

const TwoFactorAuth = ({ isOpen, onClose, onVerify }) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleVerify = () => {
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTimeLeft(300);
    setIsResending(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '400px', background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <i className="fa-solid fa-shield-check" style={{ fontSize: '48px', color: '#0ea5e9', marginBottom: '16px' }}></i>
          <h3 style={{ margin: '0 0 8px 0' }}>Two-Factor Authentication</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Enter the 6-digit code sent to your phone</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            style={{ 
              width: '200px', 
              padding: '16px', 
              fontSize: '24px', 
              textAlign: 'center', 
              letterSpacing: '8px', 
              border: '2px solid #e2e8f0', 
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
            maxLength="6"
            autoFocus
          />
        </div>

        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#64748b' }}>
          {timeLeft > 0 ? (
            <span>Code expires in {formatTime(timeLeft)}</span>
          ) : (
            <span style={{ color: '#ef4444' }}>Code expired</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={onClose}
            style={{ padding: '12px 24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            onClick={handleResend}
            disabled={isResending || timeLeft > 240}
            style={{ 
              padding: '12px 24px', 
              background: timeLeft <= 240 ? '#f8fafc' : '#e2e8f0', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              cursor: timeLeft <= 240 ? 'pointer' : 'not-allowed',
              color: timeLeft <= 240 ? '#1e293b' : '#94a3b8'
            }}
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </button>
          <button 
            onClick={handleVerify}
            disabled={code.length !== 6}
            style={{ 
              padding: '12px 24px', 
              background: code.length === 6 ? '#0ea5e9' : '#e2e8f0', 
              color: code.length === 6 ? 'white' : '#94a3b8',
              border: 'none', 
              borderRadius: '8px', 
              cursor: code.length === 6 ? 'pointer' : 'not-allowed'
            }}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;