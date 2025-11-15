import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect when an element is visible in the viewport.
 * @param {object} options - IntersectionObserver options (e.g., { threshold: 0.1, triggerOnce: true }).
 * @returns {[React.RefObject, boolean]} - A ref to attach to the element and a boolean indicating if it's visible.
 */
export const useIntersectionObserver = (options) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (options?.triggerOnce) {
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px', ...options }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return [ref, isIntersecting];
};