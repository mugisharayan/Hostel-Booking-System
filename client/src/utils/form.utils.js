// Form utility functions

// Password validation utilities
export const PASSWORD_VALIDATIONS = {
  length: (password) => password.length >= 8,
  uppercase: (password) => /[A-Z]/.test(password),
  lowercase: (password) => /[a-z]/.test(password),
  number: (password) => /[0-9]/.test(password),
  specialChar: (password) => /[^A-Za-z0-9]/.test(password),
};

export const validatePassword = (password) => {
  return Object.entries(PASSWORD_VALIDATIONS).reduce((acc, [key, validator]) => {
    acc[key] = validator(password);
    return acc;
  }, {});
};

export const isPasswordValid = (validations) => {
  return Object.values(validations).every(Boolean);
};

export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword && confirmPassword !== '';
};

// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

// Form state management
export const createFormState = (initialValues = {}) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const setValue = React.useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setError = React.useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const setTouched = React.useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const resetForm = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched,
    resetForm
  };
};

// Navigation utilities
export const getRedirectPath = (userRole, redirectTo) => {
  if (userRole === 'Custodian') {
    return '/custodian-dashboard';
  }

  switch (redirectTo) {
    case 'hostels':
      return '/hostels';
    case 'booking':
      return '/booking';
    default:
      return '/dashboard';
  }
};

// Toast/notification utilities
export const showNotification = (message, type = 'info') => {
  // This is a placeholder - in a real app, you'd use a toast library
  console.log(`${type.toUpperCase()}: ${message}`);
  
  // For now, use alert for errors and console.log for info
  if (type === 'error') {
    alert(message);
  }
};

// Form submission utilities
export const handleAsyncSubmit = async (submitFn, onSuccess, onError) => {
  try {
    const result = await submitFn();
    if (onSuccess) onSuccess(result);
    return result;
  } catch (error) {
    if (onError) onError(error);
    throw error;
  }
};