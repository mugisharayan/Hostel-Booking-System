import React from 'react';

const Timeline = ({ events, title = "Maintenance Schedule" }) => {
  const defaultEvents = [
    { id: 1, title: 'Room A-105 Plumbing', date: '2024-01-15', time: '09:00', status: 'scheduled', priority: 'high' },
    { id: 2, title: 'Block B Cleaning', date: '2024-01-16', time: '14:00', status: 'in-progress', priority: 'medium' },
    { id: 3, title: 'WiFi Router Replacement', date: '2024-01-17', time: '11:00', status: 'completed', priority: 'low' },
    { id: 4, title: 'Room C-201 AC Repair', date: '2024-01-18', time: '10:30', status: 'scheduled', priority: 'high' }
  ];

  const timelineEvents = events || defaultEvents;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return 'fa-check-circle';
      case 'in-progress': return 'fa-clock';
      case 'scheduled': return 'fa-calendar';
      default: return 'fa-circle';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'scheduled': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="timeline-container">
      <h3>{title}</h3>
      <div className="timeline">
        {timelineEvents.map((event, index) => (
          <div key={event.id} className="timeline-item">
            <div className={`timeline-marker ${getStatusColor(event.status)}`}>
              <i className={`fa-solid ${getStatusIcon(event.status)}`}></i>
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h4>{event.title}</h4>
                <span className={`priority-badge ${getPriorityColor(event.priority)}`}>
                  {event.priority}
                </span>
              </div>
              <div className="timeline-meta">
                <span className="timeline-date">
                  <i className="fa-solid fa-calendar"></i>
                  {event.date}
                </span>
                <span className="timeline-time">
                  <i className="fa-solid fa-clock"></i>
                  {event.time}
                </span>
              </div>
            </div>
            {index < timelineEvents.length - 1 && <div className="timeline-line"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;