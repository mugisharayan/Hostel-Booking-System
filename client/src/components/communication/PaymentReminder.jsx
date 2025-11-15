import React, { useState } from 'react';

const PaymentReminder = ({ isOpen, onClose }) => {
  const [reminderType, setReminderType] = useState('overdue');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [customMessage, setCustomMessage] = useState('');

  const overduePayments = [
    { id: 'ST001', name: 'Sarah Johnson', room: 'A-104', amount: 'UGX 1,200,000', daysOverdue: 5 },
    { id: 'ST002', name: 'Michael Chen', room: 'B-205', amount: 'UGX 1,500,000', daysOverdue: 2 }
  ];

  const upcomingPayments = [
    { id: 'ST003', name: 'Emma Wilson', room: 'C-301', amount: 'UGX 1,300,000', dueDate: '2024-01-20' },
    { id: 'ST004', name: 'James Brown', room: 'A-205', amount: 'UGX 1,400,000', dueDate: '2024-01-22' }
  ];

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSendReminders = () => {
    if (selectedStudents.length > 0) {
      onClose();
    }
  };

  const getDefaultMessage = () => {
    if (reminderType === 'overdue') {
      return 'Your payment is overdue. Please make payment as soon as possible to avoid any inconvenience.';
    }
    return 'Your payment is due soon. Please ensure payment is made by the due date.';
  };

  if (!isOpen) return null;

  const currentList = reminderType === 'overdue' ? overduePayments : upcomingPayments;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '700px', background: 'white', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}><i className="fas fa-bell"></i> Payment Reminders</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button 
            onClick={() => setReminderType('overdue')}
            style={{ 
              padding: '8px 16px', 
              background: reminderType === 'overdue' ? '#ef4444' : '#f8fafc', 
              color: reminderType === 'overdue' ? 'white' : '#64748b',
              border: '1px solid #e2e8f0', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            Overdue ({overduePayments.length})
          </button>
          <button 
            onClick={() => setReminderType('upcoming')}
            style={{ 
              padding: '8px 16px', 
              background: reminderType === 'upcoming' ? '#f59e0b' : '#f8fafc', 
              color: reminderType === 'upcoming' ? 'white' : '#64748b',
              border: '1px solid #e2e8f0', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            Due Soon ({upcomingPayments.length})
          </button>
        </div>

        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          {currentList.map(student => (
            <div key={student.id} style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input 
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleStudentSelect(student.id)}
                style={{ cursor: 'pointer' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '14px' }}>{student.name}</strong>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: reminderType === 'overdue' ? '#ef4444' : '#f59e0b' }}>
                    {student.amount}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Room {student.room} • {student.id}
                </div>
                <div style={{ fontSize: '11px', color: reminderType === 'overdue' ? '#ef4444' : '#f59e0b' }}>
                  {reminderType === 'overdue' 
                    ? `${student.daysOverdue} days overdue` 
                    : `Due: ${student.dueDate}`
                  }
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Message Template
          </label>
          <textarea 
            value={customMessage || getDefaultMessage()}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Customize your reminder message..."
            rows="3"
            style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onClose}
              style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSendReminders}
              disabled={selectedStudents.length === 0}
              style={{ 
                padding: '8px 16px', 
                background: selectedStudents.length > 0 ? '#0ea5e9' : '#f8fafc', 
                color: selectedStudents.length > 0 ? 'white' : '#64748b',
                border: 'none', 
                borderRadius: '6px', 
                cursor: selectedStudents.length > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              Send Reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReminder;