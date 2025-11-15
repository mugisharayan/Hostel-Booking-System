import React from 'react';
import PropTypes from 'prop-types';
import { useAuthModal } from '../../hooks/useAuthModal';
import '../../styles/password-input.css';

const AuthModal = ({ isOpen, onClose, redirectTo = null }) => {
  const {
    view,
    formData,
    showPassword,
    showConfirmPassword,
    passwordValidations,
    isLoading,
    isPasswordValid,
    passwordsMatch,
    updateFormData,
    updateHostelInfo,
    setShowPassword,
    setShowConfirmPassword,
    switchView,
    handleLogin,
    handleSignup,
    handleForgotPassword
  } = useAuthModal(redirectTo);

  // Event handlers
  const onLoginSubmit = (e) => {
    e.preventDefault();
    handleLogin(onClose);
  };

  const onSignupSubmit = (e) => {
    e.preventDefault();
    handleSignup(onClose);
  };

  const onForgotPasswordSubmit = (e) => {
    e.preventDefault();
    handleForgotPassword(onClose);
  };



  if (!isOpen) return null;

  const handleFormSwitch = (e, type) => {
    e.preventDefault();
    switchView(type);
  };

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content auth-modal">
        <div className="auth-image-panel">
          <h2>Your next <br />adventure <br />awaits.</h2>
        </div>
        <div className="auth-form-panel">
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
          <div className="auth-form-container">
            {/* Login Form */}
            {view === 'login' && (
              <div id="loginForm" key="login">
                <h3>Welcome Back</h3>
                <p className="muted">Login to access your account and bookings.</p>
                <form onSubmit={onLoginSubmit}>
                  <input 
                    type="email" 
                    id="loginEmail" 
                    name="email" 
                    placeholder="Email Address" 
                    required 
                    value={formData.email} 
                    onChange={(e) => updateFormData('email', e.target.value)} 
                  />
                  <div className="password-input-wrapper">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      id="loginPassword" 
                      name="password" 
                      placeholder="Password" 
                      required 
                      value={formData.password} 
                      onChange={(e) => updateFormData('password', e.target.value)} 
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  <div className="form-link-right">
                    <a href="#" onClick={(e) => handleFormSwitch(e, 'forgotPassword')}>Forgot Password?</a>
                  </div>
                  <button type="submit" className="btn primary full-width" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
                <p className="form-switcher">Don't have an account? <a href="#" onClick={(e) => handleFormSwitch(e, 'signup')}>Sign Up</a></p>
              </div>
            )}
            {/* Signup Form */}
            {view === 'signup' && (
              <div id="signupForm" key="signup">
                <h3>Create an Account</h3>
                <p className="muted">Join us to easily book and manage your hostel stays.</p>
                <form onSubmit={onSignupSubmit}>
                  <input 
                    type="text" 
                    id="signupFullName" 
                    name="fullName" 
                    placeholder="Full Name" 
                    required 
                    value={formData.fullName} 
                    onChange={(e) => updateFormData('fullName', e.target.value)} 
                  />
                  <input 
                    type="email" 
                    id="signupEmail" 
                    name="email" 
                    placeholder="Email Address" 
                    required 
                    value={formData.email} 
                    onChange={(e) => updateFormData('email', e.target.value)} 
                  />
                  <div className="form-group">
                    <label className="form-label" aria-label="I am a:">I am a:</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="role" 
                          value="Student" 
                          checked={formData.role === 'Student'} 
                          onChange={(e) => updateFormData('role', e.target.value)} 
                        />
                        Student
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="role" 
                          value="Custodian" 
                          checked={formData.role === 'Custodian'} 
                          onChange={(e) => updateFormData('role', e.target.value)} 
                        />
                        Custodian
                      </label>
                    </div>
                  </div>
                  {formData.role === 'Custodian' && (
                    <div className="custodian-fields-wrapper">
                      <div className="separator"><span>Hostel Information</span></div>
                      <input 
                        type="text" 
                        id="hostelName" 
                        name="hostelName" 
                        placeholder="Hostel Name" 
                        required 
                        value={formData.hostelInfo.hostelName} 
                        onChange={(e) => updateHostelInfo('hostelName', e.target.value)} 
                      />
                      <input 
                        type="tel" 
                        id="hostelContact" 
                        name="hostelContact" 
                        placeholder="Hostel Contact Number" 
                        required 
                        value={formData.hostelInfo.hostelContact} 
                        onChange={(e) => updateHostelInfo('hostelContact', e.target.value)} 
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <div className="password-input-wrapper">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        id="signupPassword" 
                        name="password" 
                        placeholder="Create Password" 
                        required 
                        value={formData.password} 
                        onChange={(e) => updateFormData('password', e.target.value)} 
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    <div className="password-strength-indicator">
                      <ul>
                        <li className={passwordValidations.length ? 'valid' : ''}><i className={`fas ${passwordValidations.length ? 'fa-check-circle' : 'fa-circle'}`}></i> At least 8 characters</li>
                        <li className={passwordValidations.uppercase ? 'valid' : ''}><i className={`fas ${passwordValidations.uppercase ? 'fa-check-circle' : 'fa-circle'}`}></i> One uppercase letter</li>
                        <li className={passwordValidations.lowercase ? 'valid' : ''}><i className={`fas ${passwordValidations.lowercase ? 'fa-check-circle' : 'fa-circle'}`}></i> One lowercase letter</li>
                        <li className={passwordValidations.number ? 'valid' : ''}><i className={`fas ${passwordValidations.number ? 'fa-check-circle' : 'fa-circle'}`}></i> One number</li>
                        <li className={passwordValidations.specialChar ? 'valid' : ''}><i className={`fas ${passwordValidations.specialChar ? 'fa-check-circle' : 'fa-circle'}`}></i> One special character</li>
                      </ul>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="password-input-wrapper">
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        required 
                        value={formData.confirmPassword} 
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)} 
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    {formData.confirmPassword && !passwordsMatch && (
                      <div className="password-match-indicator">
                        <span style={{color: 'red', fontSize: '12px'}}><i className="fas fa-times-circle"></i> Passwords do not match</span>
                      </div>
                    )}
                    {formData.confirmPassword && passwordsMatch && (
                      <div className="password-match-indicator">
                        <span style={{color: 'green', fontSize: '12px'}}><i className="fas fa-check-circle"></i> Passwords match</span>
                      </div>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    className="btn primary full-width" 
                    disabled={!isPasswordValid || !passwordsMatch || isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
                <p className="form-switcher">Already have an account? <a href="#" onClick={(e) => handleFormSwitch(e, 'login')}>Login</a></p>
              </div>
            )}
            {/* Forgot Password Form */}
            {view === 'forgotPassword' && (
              <div id="forgotPasswordForm" key="forgot">
                <h3>Reset Password</h3>
                <p className="muted">Enter your email and we'll send you a link to reset your password.</p>
                <form onSubmit={onForgotPasswordSubmit}>
                  <input 
                    type="email" 
                    id="forgotEmail" 
                    name="email" 
                    placeholder="Email Address" 
                    required 
                    value={formData.email} 
                    onChange={(e) => updateFormData('email', e.target.value)} 
                  />
                  <button type="submit" className="btn primary full-width" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
                <p className="form-switcher">Remember your password? <a href="#" onClick={(e) => handleFormSwitch(e, 'login')}>Back to Login</a></p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  redirectTo: PropTypes.string
};

export default AuthModal;