import React, { useState, useEffect, useContext } from 'react';
import { useMessages } from '../../contexts/MessageContext';
import { AuthContext } from '../../features/auth/AuthContext';
// Fixed import path

const StudentMessageCenter = ({ isOpen, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const { conversations, sendMessage, createConversation } = useMessages();
  const { userProfile } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen && userProfile) {
      // Find or create conversation for this student
      let conv = conversations.find(c => c.studentId === userProfile.studentId);
      if (!conv) {
        const newConvId = createConversation(
          userProfile.name,
          userProfile.studentId,
          userProfile.room || 'Not assigned'
        );
        setConversationId(newConvId);
      } else {
        setConversationId(conv.id);
      }
    }
  }, [isOpen, userProfile, conversations, createConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversationId) return;
    
    try {
      sendMessage(conversationId, newMessage.trim(), 'student');
      setNewMessage('');
      setError('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content message-center-modal">
        <div className="modal-header">
          <h3><i className="fas fa-comments"></i> Message Custodian</h3>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="message-list">
          {conversationId && conversations.find(c => c.id === conversationId)?.messages?.map(msg => (
            <div key={msg.id} className={`message-item ${msg.senderType}`}>
              <div className="message-content">
                <p>{msg.message}</p>
                <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          )) || <p>No messages yet. Start a conversation!</p>}
        </div>
        
        <div className="message-input-area">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="btn primary">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentMessageCenter;