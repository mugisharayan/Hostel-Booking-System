import React from 'react';

const PaymentStatus = ({ status, transactionId, amount, onRetry, onCancel }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: 'fa-spinner fa-spin',
          color: '#0ea5e9',
          bg: '#e0f2fe',
          title: 'Processing Payment',
          message: 'Please wait while we process your payment...'
        };
      case 'success':
        return {
          icon: 'fa-check-circle',
          color: '#10b981',
          bg: '#d1fae5',
          title: 'Payment Successful',
          message: 'Your payment has been processed successfully!'
        };
      case 'failed':
        return {
          icon: 'fa-times-circle',
          color: '#ef4444',
          bg: '#fee2e2',
          title: 'Payment Failed',
          message: 'There was an issue processing your payment.'
        };
      case 'pending':
        return {
          icon: 'fa-clock',
          color: '#f59e0b',
          bg: '#fef3c7',
          title: 'Payment Pending',
          message: 'Your payment is being verified...'
        };
      default:
        return {
          icon: 'fa-info-circle',
          color: '#6b7280',
          bg: '#f3f4f6',
          title: 'Payment Status',
          message: 'Checking payment status...'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div style={{
      background: config.bg,
      border: `2px solid ${config.color}`,
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center',
      maxWidth: '400px',
      margin: '20px auto'
    }}>
      <div style={{
        fontSize: '48px',
        color: config.color,
        marginBottom: '16px'
      }}>
        <i className={`fa-solid ${config.icon}`}></i>
      </div>
      
      <h3 style={{
        color: config.color,
        marginBottom: '8px',
        fontSize: '20px'
      }}>
        {config.title}
      </h3>
      
      <p style={{
        color: '#374151',
        marginBottom: '16px'
      }}>
        {config.message}
      </p>
      
      {transactionId && (
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '20px'
        }}>
          Transaction ID: <strong>{transactionId}</strong>
        </p>
      )}
      
      {amount && (
        <p style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: config.color,
          marginBottom: '20px'
        }}>
          Amount: UGX {amount.toLocaleString()}
        </p>
      )}
      
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {status === 'failed' && onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '10px 20px',
              background: config.color,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Retry Payment
          </button>
        )}
        
        {(status === 'failed' || status === 'pending') && onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: '#6b7280',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;