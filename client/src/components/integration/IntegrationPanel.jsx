import React, { useState } from 'react';
import { sendEmail, sendSMS, syncStudentData } from '../../utils/integrations';

const IntegrationPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleEmailTest = async () => {
    setIsLoading(true);
    const success = await sendEmail('test@example.com', 'Test Email', 'Test message');
    setResult(success ? 'Email sent successfully!' : 'Email failed to send.');
    setIsLoading(false);
  };

  const handleSMSTest = async () => {
    setIsLoading(true);
    const success = await sendSMS('+256771234567', 'Test SMS message');
    setResult(success ? 'SMS sent successfully!' : 'SMS failed to send.');
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '500px', background: 'white', borderRadius: '12px' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>System Integrations</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          <button 
            onClick={() => setActiveTab('email')}
            style={{ flex: 1, padding: '12px', border: 'none', background: activeTab === 'email' ? '#f8fafc' : 'white', cursor: 'pointer' }}
          >
            Email
          </button>
          <button 
            onClick={() => setActiveTab('sms')}
            style={{ flex: 1, padding: '12px', border: 'none', background: activeTab === 'sms' ? '#f8fafc' : 'white', cursor: 'pointer' }}
          >
            SMS
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {activeTab === 'email' && (
            <div>
              <h4>Email Service</h4>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>Test email notifications</p>
              <button 
                onClick={handleEmailTest}
                disabled={isLoading}
                style={{ padding: '10px 20px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                {isLoading ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
          )}

          {activeTab === 'sms' && (
            <div>
              <h4>SMS Service</h4>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>Test SMS notifications</p>
              <button 
                onClick={handleSMSTest}
                disabled={isLoading}
                style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                {isLoading ? 'Sending...' : 'Send Test SMS'}
              </button>
            </div>
          )}

          {result && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: result.includes('successfully') ? '#f0fdf4' : '#fef2f2',
              borderRadius: '6px',
              color: result.includes('successfully') ? '#166534' : '#dc2626'
            }}>
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationPanel;