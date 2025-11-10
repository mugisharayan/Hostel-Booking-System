import React, { useState } from 'react';

const SupportTicketSystem = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('open');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newResponse, setNewResponse] = useState('');

  const tickets = [
    {
      id: 'TK001',
      student: 'Sarah Johnson',
      studentId: 'ST001',
      room: 'A-104',
      subject: 'Payment Issue - Transaction Failed',
      category: 'payment',
      priority: 'high',
      status: 'open',
      created: '2024-01-15 10:30 AM',
      lastUpdate: '2024-01-15 11:45 AM',
      description: 'My payment for Room A-104 failed but the amount was deducted from my account. Please help resolve this issue.',
      responses: [
        {
          id: 1,
          sender: 'Sarah Johnson',
          message: 'My payment for Room A-104 failed but the amount was deducted from my account. Transaction ID: TXN123456789',
          time: '10:30 AM',
          isStudent: true
        },
        {
          id: 2,
          sender: 'John Kamau',
          message: 'Thank you for reporting this issue. I will check with our payment processor and get back to you within 2 hours.',
          time: '11:45 AM',
          isStudent: false
        }
      ]
    },
    {
      id: 'TK002',
      student: 'Michael Chen',
      studentId: 'ST002',
      room: 'B-205',
      subject: 'Room Access Card Not Working',
      category: 'access',
      priority: 'medium',
      status: 'in-progress',
      created: '2024-01-15 09:15 AM',
      lastUpdate: '2024-01-15 10:20 AM',
      description: 'My room access card is not working. I cannot enter my room.',
      responses: [
        {
          id: 1,
          sender: 'Michael Chen',
          message: 'My room access card stopped working this morning. I cannot enter Room B-205.',
          time: '09:15 AM',
          isStudent: true
        },
        {
          id: 2,
          sender: 'John Kamau',
          message: 'I will send a technician to reprogram your access card. They should be there within 30 minutes.',
          time: '10:20 AM',
          isStudent: false
        }
      ]
    }
  ];

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'payment': return 'fa-credit-card';
      case 'access': return 'fa-key';
      case 'technical': return 'fa-wifi';
      case 'maintenance': return 'fa-wrench';
      default: return 'fa-question-circle';
    }
  };

  const handleSendResponse = () => {
    if (newResponse.trim() && selectedTicket) {
      setNewResponse('');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'open') return ticket.status === 'open';
    if (activeTab === 'in-progress') return ticket.status === 'in-progress';
    if (activeTab === 'resolved') return ticket.status === 'resolved';
    return true;
  });

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '900px', height: '600px', background: 'white', borderRadius: '12px', display: 'flex' }}>
        <div style={{ width: '300px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0 }}><i className="fas fa-ticket-alt"></i> Support Tickets</h4>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          </div>
          
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
            {['open', 'in-progress', 'resolved'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  border: 'none', 
                  background: activeTab === tab ? '#f8fafc' : 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredTickets.map(ticket => (
              <div 
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                style={{ 
                  padding: '12px', 
                  borderBottom: '1px solid #f1f5f9', 
                  cursor: 'pointer', 
                  background: selectedTicket?.id === ticket.id ? '#f8fafc' : 'white' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '12px' }}>#{ticket.id}</strong>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: ticket.priority === 'high' ? '#fee2e2' : '#fef3c7', color: ticket.priority === 'high' ? '#dc2626' : '#d97706' }}>
                    {ticket.priority}
                  </span>
                </div>
                <h5 style={{ margin: '4px 0', fontSize: '13px' }}>{ticket.subject}</h5>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#64748b' }}>{ticket.student} • Room {ticket.room}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <i className={`fas ${getCategoryIcon(ticket.category)}`} style={{ fontSize: '10px', color: '#64748b' }}></i>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{ticket.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedTicket ? (
            <>
              <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>#{selectedTicket.id} - {selectedTicket.subject}</h4>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                  <span><i className="fas fa-user"></i> {selectedTicket.student}</span>
                  <span><i className="fas fa-door-open"></i> Room {selectedTicket.room}</span>
                  <span><i className="fas fa-calendar"></i> {selectedTicket.created}</span>
                </div>
              </div>
              
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <h5 style={{ margin: '0 0 8px 0' }}>Initial Request</h5>
                  <p style={{ margin: 0, fontSize: '14px' }}>{selectedTicket.description}</p>
                </div>

                {selectedTicket.responses.map(response => (
                  <div key={response.id} style={{ marginBottom: '12px', display: 'flex', justifyContent: response.isStudent ? 'flex-start' : 'flex-end' }}>
                    <div style={{ 
                      maxWidth: '70%', 
                      padding: '8px 12px', 
                      borderRadius: '8px',
                      background: response.isStudent ? '#f1f5f9' : '#0ea5e9',
                      color: response.isStudent ? '#1e293b' : 'white'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>{response.sender}</div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '13px' }}>{response.message}</p>
                      <span style={{ fontSize: '10px', opacity: 0.7 }}>{response.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button 
                    onClick={() => setNewResponse('Thank you for contacting support. I am looking into your issue.')}
                    style={{ padding: '4px 8px', fontSize: '11px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Investigating
                  </button>
                  <button 
                    onClick={() => setNewResponse('Your issue has been resolved. Please let me know if you need further assistance.')}
                    style={{ padding: '4px 8px', fontSize: '11px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Resolved
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <textarea 
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Type your response..."
                    style={{ flex: 1, padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', resize: 'none', height: '60px' }}
                  />
                  <button 
                    onClick={handleSendResponse}
                    disabled={!newResponse.trim()}
                    style={{ padding: '8px 16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexDirection: 'column' }}>
              <i className="fas fa-ticket-alt" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
              <h3>Select a ticket</h3>
              <p>Choose a support ticket to view details and respond</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketSystem;