import React, { useState } from 'react';

const BookingManagement = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookings = {
    pending: [
      { id: 'BK001', student: 'Sarah Johnson', studentId: 'ST001', room: 'A-104', semester: 'Spring 2025', amount: 'UGX 1,200,000', date: '2024-01-15', status: 'pending' },
      { id: 'BK002', student: 'Michael Chen', studentId: 'ST002', room: 'B-205', semester: 'Spring 2025', amount: 'UGX 1,500,000', date: '2024-01-14', status: 'pending' }
    ],
    confirmed: [
      { id: 'BK003', student: 'Emma Wilson', studentId: 'ST003', room: 'C-301', semester: 'Spring 2025', amount: 'UGX 1,300,000', date: '2024-01-13', status: 'confirmed', checkIn: '2024-01-20' }
    ]
  };

  const handleBookingAction = (bookingId, action) => {
    onClose();
  };

  if (!isOpen) return null;

  const currentBookings = bookings[activeTab] || [];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '800px', height: '500px', background: 'white', borderRadius: '12px', display: 'flex' }}>
        <div style={{ width: '250px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0 }}><i className="fas fa-calendar-check"></i> Bookings</h4>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          </div>
          
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {['pending', 'confirmed'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: '6px 10px', 
                  border: 'none', 
                  background: activeTab === tab ? '#0ea5e9' : '#f8fafc',
                  color: activeTab === tab ? 'white' : '#64748b',
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {tab} ({bookings[tab]?.length || 0})
              </button>
            ))}
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {currentBookings.map(booking => (
              <div 
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                style={{ 
                  padding: '10px 12px', 
                  borderBottom: '1px solid #f1f5f9', 
                  cursor: 'pointer',
                  background: selectedBooking?.id === booking.id ? '#f8fafc' : 'white'
                }}
              >
                <strong style={{ fontSize: '12px' }}>{booking.student}</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Room {booking.room} • {booking.amount}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedBooking ? (
            <>
              <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 6px 0' }}>{selectedBooking.student}</h4>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  #{selectedBooking.id} • Room {selectedBooking.room} • {selectedBooking.semester}
                </div>
              </div>
              
              <div style={{ flex: 1, padding: '16px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                    <div><strong>Amount:</strong> {selectedBooking.amount}</div>
                    <div><strong>Date:</strong> {selectedBooking.date}</div>
                    <div><strong>Status:</strong> {selectedBooking.status}</div>
                    {selectedBooking.checkIn && <div><strong>Check-in:</strong> {selectedBooking.checkIn}</div>}
                  </div>
                </div>

                {selectedBooking.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                    <button 
                      onClick={() => handleBookingAction(selectedBooking.id, 'approve')}
                      style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleBookingAction(selectedBooking.id, 'reject')}
                      style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                    >
                      Reject
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{ padding: '4px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>
                    Message
                  </button>
                  <button style={{ padding: '4px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>
                    Call
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexDirection: 'column' }}>
              <i className="fas fa-calendar-check" style={{ fontSize: '32px', marginBottom: '12px' }}></i>
              <h4>Select a booking</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;