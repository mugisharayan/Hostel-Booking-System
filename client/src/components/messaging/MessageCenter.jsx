import React, { useState } from 'react';

const MessageCenter = ({ isOpen, onClose }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    { id: 1, student: 'Jane Doe', lastMessage: 'Payment submitted for Room A-104', time: '2 min ago', unread: true },
    { id: 2, student: 'John Smith', lastMessage: 'Room maintenance request', time: '1 hour ago', unread: false }
  ];

  const messages = selectedConversation ? [
    { id: 1, sender: 'Jane Doe', message: 'Hi, I submitted my payment for Room A-104', time: '10:30 AM', isStudent: true },
    { id: 2, sender: 'You', message: 'Thank you! It will be processed within 24 hours.', time: '10:35 AM', isStudent: false }
  ] : [];

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '700px', height: '500px', background: 'white', borderRadius: '12px', display: 'flex' }}>
        <div style={{ width: '250px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0 }}>Messages</h4>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selectedConversation?.id === conv.id ? '#f8fafc' : 'white' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h5 style={{ margin: 0, fontSize: '14px' }}>{conv.student}</h5>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{conv.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{conv.lastMessage}</p>
                {conv.unread && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0ea5e9', marginTop: '4px' }}></div>}
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <>
              <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: 0 }}>{selectedConversation.student}</h4>
              </div>
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ marginBottom: '12px', display: 'flex', justifyContent: msg.isStudent ? 'flex-start' : 'flex-end' }}>
                    <div style={{ 
                      maxWidth: '70%', 
                      padding: '8px 12px', 
                      borderRadius: '8px',
                      background: msg.isStudent ? '#f1f5f9' : '#0ea5e9',
                      color: msg.isStudent ? '#1e293b' : 'white'
                    }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>{msg.message}</p>
                      <span style={{ fontSize: '11px', opacity: 0.7 }}>{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message..."
                  style={{ flex: 1, padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                />
                <button style={{ padding: '8px 16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;