

import React, { useEffect } from 'react';
import { processPayment } from '../services/paymentService';

const PaymentStatus = ({ paymentData, onPaymentComplete }) => {
  useEffect(() => {
    processPaymentProcess();
  }, []);

  const processPaymentProcess = async () => {
    try {
      const result = await processPayment(paymentData.paymentId, paymentData.paymentToken);
      onPaymentComplete(true, result.receiptUrl);
    } catch (error) {
      onPaymentComplete(false);
    }
  };

  return (
    <div className="payment-status">
      <h2>Processing Your Payment</h2>
      <div className="loading-spinner"></div>
      <p>Please wait while we process your payment...</p>
      <p>Do not refresh or close this page.</p>
    </div>
  );
};

export default PaymentStatus;