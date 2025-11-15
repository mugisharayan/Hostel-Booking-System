import React, { createContext, useContext, useState, useEffect } from 'react';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Load conversations from localStorage
    const stored = JSON.parse(localStorage.getItem('conversations') || '[]');
    setConversations(stored);
  }, []);

  const saveConversations = (convs) => {
    setConversations(convs);
    localStorage.setItem('conversations', JSON.stringify(convs));
  };

  const sendMessage = (conversationId, message, senderType) => {
    const newMessage = {
      id: Date.now(),
      message,
      senderType, // 'student' or 'custodian'
      timestamp: new Date().toISOString(),
      read: false
    };

    const updated = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: message,
          lastMessageTime: new Date().toISOString(),
          unread: senderType === 'student' ? true : conv.unread
        };
      }
      return conv;
    });

    saveConversations(updated);
  };

  const createConversation = (studentName, studentId, room) => {
    const newConv = {
      id: Date.now(),
      student: studentName,
      studentId,
      room,
      messages: [],
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unread: false,
      type: 'general',
      priority: 'low'
    };

    saveConversations([...conversations, newConv]);
    return newConv.id;
  };

  const markAsRead = (conversationId) => {
    const updated = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unread: false,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    });

    saveConversations(updated);
  };

  return (
    <MessageContext.Provider value={{
      conversations,
      sendMessage,
      createConversation,
      markAsRead
    }}>
      {children}
    </MessageContext.Provider>
  );
};