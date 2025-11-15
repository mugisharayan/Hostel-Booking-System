import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../features/auth/AuthContext';
import apiService from '../service/api.service';
import {
  validatePassword,
  isPasswordValid,
  doPasswordsMatch,
  getRedirectPath,
  showNotification,
  handleAsyncSubmit
} from '../utils/form.utils';

export const useAuthModal = (redirectTo) => {
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'Student',
    hostelInfo: { hostelName: '', hostelContact: '' }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Update password validations when password changes
  useEffect(() => {
    if (view === 'signup') {
      setPasswordValidations(validatePassword(formData.password));
    }
  }, [formData.password, view]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateHostelInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      hostelInfo: { ...prev.hostelInfo, [field]: value }
    }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      role: 'Student',
      hostelInfo: { hostelName: '', hostelContact: '' }
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordValidations({});
  };

  const switchView = (newView) => {
    setView(newView);
    resetForm();
  };

  const handleSuccessfulAuth = async (userData, onClose) => {
    await loginWithUserData(userData);
    showNotification('Authentication successful!', 'success');
    onClose();

    setTimeout(() => {
      const redirectPath = getRedirectPath(userData.role, redirectTo);
      if (userData.role === 'Custodian') {
        window.location.href = redirectPath;
      } else {
        navigate(redirectPath);
      }
    }, 200);
  };

  const handleLogin = async (onClose) => {
    return handleAsyncSubmit(
      async () => {
        setIsLoading(true);
        const response = await apiService.auth.login(formData.email, formData.password);
        localStorage.setItem('auth', JSON.stringify(response.data));
        return response.data;
      },
      (userData) => handleSuccessfulAuth(userData, onClose),
      (error) => {
        console.error('Login error:', error);
        showNotification(
          'Login failed: ' + (error.response?.data?.message || 'Invalid email or password'),
          'error'
        );
        setIsLoading(false);
      }
    );
  };

  const handleSignup = async (onClose) => {
    const passwordValid = isPasswordValid(passwordValidations);
    const passwordsMatch = doPasswordsMatch(formData.password, formData.confirmPassword);

    if (!passwordValid) {
      showNotification('Please ensure your password meets all requirements.', 'error');
      return;
    }

    if (!passwordsMatch) {
      showNotification('Passwords do not match.', 'error');
      return;
    }

    return handleAsyncSubmit(
      async () => {
        setIsLoading(true);
        const response = await apiService.auth.register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        localStorage.setItem('auth', JSON.stringify(response.data));
        return response.data;
      },
      (userData) => handleSuccessfulAuth(userData, onClose),
      (error) => {
        console.error('Registration error:', error);
        if (error.response?.status === 400) {
          showNotification('User already exists', 'error');
        } else {
          showNotification(
            'Registration failed: ' + (error.response?.data?.message || error.message),
            'error'
          );
        }
        setIsLoading(false);
      }
    );
  };

  const handleForgotPassword = async (onClose) => {
    showNotification('If an account with this email exists, a password reset link has been sent.');
    onClose();
  };

  return {
    view,
    formData,
    showPassword,
    showConfirmPassword,
    passwordValidations,
    isLoading,
    isPasswordValid: isPasswordValid(passwordValidations),
    passwordsMatch: doPasswordsMatch(formData.password, formData.confirmPassword),
    updateFormData,
    updateHostelInfo,
    setShowPassword,
    setShowConfirmPassword,
    switchView,
    handleLogin,
    handleSignup,
    handleForgotPassword
  };
};