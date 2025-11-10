import React, { useState } from 'react';
import bookingService from '../../service/booking.service';
import paymentService from '../../service/payment.service';
import authService from '../../service/auth.service';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test, success, message) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    // Test API connectivity
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      addResult('API Connectivity', true, data.message);
    } catch (error) {
      addResult('API Connectivity', false, error.message);
    }

    // Test user registration
    try {
      const testUser = {
        fullName: 'Test User',
        email: `test${Date.now()}@example.com`,
        phone: '0771234567',
        course: 'Computer Science',
        role: 'student'
      };
      await authService.register(testUser);
      addResult('User Registration', true, 'User registered successfully');
    } catch (error) {
      addResult('User Registration', false, error.message);
    }

    // Test transaction ID generation
    try {
      const transactionId = paymentService.generateTransactionId();
      addResult('Transaction ID Generation', true, `Generated: ${transactionId}`);
    } catch (error) {
      addResult('Transaction ID Generation', false, error.message);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h3>Backend Integration Test</h3>
      <button 
        onClick={runTests} 
        disabled={isLoading}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#0ea5e9', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {isLoading ? 'Running Tests...' : 'Run Tests'}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        {testResults.map((result, index) => (
          <div 
            key={index} 
            style={{ 
              padding: '10px', 
              margin: '5px 0', 
              backgroundColor: result.success ? '#d1fae5' : '#fee2e2',
              color: result.success ? '#065f46' : '#dc2626',
              borderRadius: '5px'
            }}
          >
            <strong>{result.test}</strong> [{result.timestamp}]: {result.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest;