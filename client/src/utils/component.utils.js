// Component utility functions

// Price formatting utilities
export const formatPrice = (price) => {
  if (!price || price <= 0) return null;
  
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K`;
  }
  return price.toString();
};

export const formatPriceRange = (prices) => {
  if (!prices || prices.length === 0) return 'Contact';
  
  const validPrices = prices.filter(p => p > 0);
  if (validPrices.length === 0) return 'Contact';
  
  const min = Math.min(...validPrices);
  const max = Math.max(...validPrices);
  
  if (min === max) {
    return `UGX ${formatPrice(min)}`;
  }
  
  return `UGX ${formatPrice(min)} - ${formatPrice(max)}`;
};

// Image utilities
export const getDefaultImage = (type = 'hostel') => {
  const defaults = {
    hostel: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    room: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    profile: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
  };
  
  return defaults[type] || defaults.hostel;
};

export const getImageWithFallback = (images, fallbackType = 'hostel') => {
  if (images && images.length > 0 && images[0]) {
    return images[0];
  }
  return getDefaultImage(fallbackType);
};

// Array utilities
export const limitArray = (array, limit) => {
  if (!array || !Array.isArray(array)) return [];
  return array.slice(0, limit);
};

export const getRemainingCount = (array, limit) => {
  if (!array || !Array.isArray(array)) return 0;
  return Math.max(0, array.length - limit);
};

// Event handling utilities
export const createAsyncHandler = (asyncFn, errorHandler) => {
  return async (event) => {
    try {
      await asyncFn(event);
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        console.error('Async handler error:', error);
      }
    }
  };
};

export const stopPropagation = (handler) => {
  return (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (handler) handler(event);
  };
};

// Accessibility utilities
export const createAriaLabel = (action, item, condition) => {
  const actionText = typeof action === 'string' ? action : 'Action';
  const itemText = typeof item === 'string' ? item : 'item';
  
  if (condition !== undefined) {
    return condition ? `Remove ${itemText} from ${actionText}` : `Add ${itemText} to ${actionText}`;
  }
  
  return `${actionText} ${itemText}`;
};

// Component state utilities
export const useToggle = (initialValue = false) => {
  const [value, setValue] = React.useState(initialValue);
  
  const toggle = React.useCallback(() => {
    setValue(prev => !prev);
  }, []);
  
  const setTrue = React.useCallback(() => {
    setValue(true);
  }, []);
  
  const setFalse = React.useCallback(() => {
    setValue(false);
  }, []);
  
  return [value, { toggle, setTrue, setFalse, setValue }];
};

// Loading state utilities
export const createLoadingState = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const withLoading = React.useCallback(async (asyncFn) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return { isLoading, error, withLoading };
};