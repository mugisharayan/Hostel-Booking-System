import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNotifications } from '../../hooks/useNotifications';
import './CustodianNotificationBell.css';

// Constants
const POLLING_INTERVAL = 30000; // 30 seconds
const ANIMATION_DURATION = 600; // 0.6 seconds
const MAX_BADGE_COUNT = 99;
const ERROR_MESSAGES = {
  LOAD_FAILED: 'Failed to load notifications'
};

// Helper functions
const formatBadgeCount = (count) => count > MAX_BADGE_COUNT ? '99+' : count;

const buildClassName = (baseClass, conditionalClasses) => {
  return [baseClass, ...conditionalClasses.filter(Boolean)].join(' ');
};

const buildNotificationText = (count) => {
  const hasUnread = count > 0;
  const countText = hasUnread ? ` (${count} unread)` : '';
  return `Notifications${countText}`;
};

const buildAriaLabel = (count) => {
  const hasUnread = count > 0;
  const statusText = hasUnread ? `, ${count} unread` : ', no unread notifications';
  return `Notifications${statusText}`;
};

const CustodianNotificationBell = ({ 
  onClick, 
  pollingInterval = POLLING_INTERVAL,
  animationDuration = ANIMATION_DURATION 
}) => {
  const { unreadCount, isLoading, hasError } = useNotifications(pollingInterval);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousCountRef = useRef(0);

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), animationDuration);
  }, [animationDuration]);

  // Trigger animation when count increases
  React.useEffect(() => {
    if (unreadCount > previousCountRef.current) {
      triggerAnimation();
    }
    previousCountRef.current = unreadCount;
  }, [unreadCount, triggerAnimation]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  // Build dynamic class names
  const buttonClassName = buildClassName('icon-btn notification-bell', [
    isAnimating && 'animate-bell',
    hasError && 'error'
  ]);

  const iconClassName = buildClassName('fa-solid fa-bell', [
    isLoading && 'fa-spin'
  ]);

  return (
    <button 
      className={buttonClassName}
      onClick={handleClick}
      title={buildNotificationText(unreadCount)}
      aria-label={buildAriaLabel(unreadCount)}
      disabled={isLoading}
    >
      <i className={iconClassName} />
      
      {unreadCount > 0 && (
        <span className="notification-badge" aria-hidden="true">
          {formatBadgeCount(unreadCount)}
        </span>
      )}
      
      {hasError && (
        <span className="error-indicator" title={ERROR_MESSAGES.LOAD_FAILED}>
          <i className="fa-solid fa-exclamation-triangle" />
        </span>
      )}
    </button>
  );
};

CustodianNotificationBell.propTypes = {
  onClick: PropTypes.func,
  pollingInterval: PropTypes.number,
  animationDuration: PropTypes.number
};

export default CustodianNotificationBell;