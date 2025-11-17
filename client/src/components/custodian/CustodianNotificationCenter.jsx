import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import custodianService from '../../service/custodian.service';
import { formatDate } from '../../utils/component.utils';

// Constants
const NOTIFICATION_ICONS = {
  payment: 'fa-credit-card',
  maintenance: 'fa-wrench',
  default: 'fa-bell'
};

const NOTIFICATION_COLORS = {
  payment: '#10b981',
  maintenance: '#f59e0b',
  default: '#64748b'
};

const STYLES = {
  modalContent: { maxWidth: '500px', width: '90vw' },
  notificationList: { maxHeight: '400px', overflowY: 'auto' },
  loadingContainer: { textAlign: 'center', padding: '20px' },
  emptyState: { textAlign: 'center', padding: '40px', color: '#64748b' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  notificationItem: {
    padding: '16px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    gap: '12px'
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  contentContainer: { flex: 1 },
  title: { margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' },
  message: { margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' },
  timestamp: { fontSize: '12px', color: '#94a3b8' }
};

// Helper functions
const getNotificationIcon = (type) => NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.default;

const getNotificationColor = (type) => NOTIFICATION_COLORS[type] || NOTIFICATION_COLORS.default;

const handleOverlayClick = (event, onClose) => {
  if (event.target.className.includes('modal-overlay')) {
    onClose();
  }
};

// Components
const LoadingState = () => (
  <div style={STYLES.loadingContainer}>
    <i className="fas fa-spinner fa-spin"></i> Loading...
  </div>
);

const EmptyState = () => (
  <div style={STYLES.emptyState}>
    <i className="fas fa-bell-slash" style={STYLES.emptyIcon}></i>
    <h4>No notifications</h4>
    <p>You're all caught up!</p>
  </div>
);

const NotificationItem = ({ notification }) => {
  const iconStyle = {
    ...STYLES.iconContainer,
    background: getNotificationColor(notification.type)
  };

  return (
    <div className="notification-item" style={STYLES.notificationItem}>
      <div style={iconStyle}>
        <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
      </div>
      <div style={STYLES.contentContainer}>
        <h5 style={STYLES.title}>{notification.title}</h5>
        <p style={STYLES.message}>{notification.message}</p>
        <span style={STYLES.timestamp}>
          {formatDate(notification.createdAt)}
        </span>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired
};

const CustodianNotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await custodianService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  const handleOverlayClickWrapper = useCallback((event) => {
    handleOverlayClick(event, onClose);
  }, [onClose]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (notifications.length === 0) return <EmptyState />;
    
    return notifications.map(notification => (
      <NotificationItem key={notification.id} notification={notification} />
    ));
  };

  return (
    <div className="modal-overlay is-visible" onClick={handleOverlayClickWrapper}>
      <div className="modal-content" style={STYLES.modalContent}>
        <div className="modal-header">
          <h3><i className="fas fa-bell"></i> Notifications</h3>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="notification-list" style={STYLES.notificationList}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

CustodianNotificationCenter.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CustodianNotificationCenter;