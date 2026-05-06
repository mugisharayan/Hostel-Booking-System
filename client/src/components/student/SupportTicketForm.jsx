import React, { useState } from 'react';

const SupportTicketForm = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send support ticket to custodian
    const ticket = {
      id: Date.now(),
      category,
      priority,
      subject,
      description,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    console.log('Support ticket:', ticket);
    alert('Support ticket submitted successfully!');
    setCategory('');
    setPriority('medium');
    setSubject('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3><i className="fas fa-life-ring"></i> Submit Support Ticket</h3>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select category</option>
                <option value="general">General Inquiry</option>
                <option value="complaint">Complaint</option>
                <option value="security">Security Issue</option>
                <option value="facilities">Facilities</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of the issue"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide detailed information about your issue..."
              rows="5"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn secondary">Cancel</button>
            <button type="submit" className="btn primary">Submit Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportTicketForm;