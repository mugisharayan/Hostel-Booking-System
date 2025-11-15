import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// Constants
const SCROLL_THRESHOLD = 300;
const SCROLL_OPTIONS = { top: 0, behavior: 'smooth' };
const ARIA_LABEL = 'Back to top';

// Helper functions
const getScrollPosition = () => window.pageYOffset;

const scrollToTop = () => {
  window.scrollTo(SCROLL_OPTIONS);
};

const buildClassName = (isVisible) => {
  return `back-to-top ${isVisible ? 'visible' : ''}`;
};

const BackToTop = ({ threshold = SCROLL_THRESHOLD }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(getScrollPosition() > threshold);
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [toggleVisibility]);

  return (
    <button
      className={buildClassName(isVisible)}
      onClick={scrollToTop}
      aria-label={ARIA_LABEL}
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
};

BackToTop.propTypes = {
  threshold: PropTypes.number
};

export default BackToTop;
