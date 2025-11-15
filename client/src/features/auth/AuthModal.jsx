import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import apiService from '../../service/api.service';
import '../../styles/password-input.css';


const AuthModal = ({ isOpen, onClose, redirectTo = null }) => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgotPassword', 'verifyEmail'
  const { login, loginWithUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Student'); // Add role state, default to student
  const [hostelInfo, setHostelInfo] = useState({ hostelName: '', hostelContact: '' });
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // In a real app, you'd use a robust toast library.
  const showToast = (message, isError = false) => {
    console.log(`Toast: ${message} (Error: ${isError})`);
    // This is a placeholder for a real toast notification.
  };
  
  useEffect(() => {
    if (view === 'signup') {
      setPasswordValidations({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[^A-Za-z0-9]/.test(password),
      });
    }
  }, [password, view]);

  const isPasswordValid = Object.values(passwordValidations).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert('Please ensure your password meets all requirements.');
      return;
    }

    if (!passwordsMatch) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await apiService.auth.register({
        fullName: fullName,
        email: email,
        password: password,
        role: role
      });

      // Auto-login after successful registration
      localStorage.setItem('auth', JSON.stringify(response.data));
      await loginWithUserData(response.data);
      
      alert('Registration successful! Welcome!');
      onClose();
      
      // Use setTimeout to allow state to update before navigation
      setTimeout(() => {
        if (response.data.role === 'Custodian') {
          console.log('Navigating to custodian dashboard, role:', response.data.role);
          window.location.href = '/custodian-dashboard';
        } else {
          // Handle different redirect scenarios for students
          if (redirectTo === 'hostels') {
            console.log('Navigating to hostels page');
            navigate('/hostels');
          } else if (redirectTo === 'booking') {
            console.log('Navigating to booking page');
            navigate('/booking');
          } else {
            console.log('Navigating to student dashboard');
            navigate('/dashboard');
          }
        }
      }, 200);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 400) {
        alert('User already exists');
      } else {
        alert('Registration failed: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await apiService.auth.login(email, password);
      
      localStorage.setItem('auth', JSON.stringify(response.data));
      await loginWithUserData(response.data);
      
      alert('Logged in successfully!');
      onClose();
      
      // Use setTimeout to allow state to update before navigation
      setTimeout(() => {
        if (response.data.role === 'Custodian') {
          console.log('Navigating to custodian dashboard, role:', response.data.role);
          window.location.href = '/custodian-dashboard';
        } else {
          console.log('Navigating to student dashboard');
          navigate('/dashboard');
        }
      }, 200);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error.response?.data?.message || 'Invalid email or password'));
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log(`Password reset requested for: ${email}`);
    showToast('If an account with this email exists, a password reset link has been sent.');
    onClose();
  };



  if (!isOpen) return null;

  const handleFormSwitch = (e, type) => {
    e.preventDefault();
    setView(type);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFullName('');
    setPasswordValidations({ length: false, uppercase: false, lowercase: false, number: false, specialChar: false });
    setHostelInfo({ hostelName: '', hostelContact: '' });
    setRole('Student'); // Reset role on switch
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
                <form onSubmit={handleLogin}>
                  <input type="email" id="loginEmail" name="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className="password-input-wrapper">
                    <input type={showPassword ? 'text' : 'password'} id="loginPassword" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  <div className="form-link-right">
                    <a href="#" onClick={(e) => handleFormSwitch(e, 'forgotPassword')}>Forgot Password?</a>
                  </div>
                  <button type="submit" className="btn primary full-width">Login</button>
                </form>
                <p className="form-switcher">Don't have an account? <a href="#" onClick={(e) => handleFormSwitch(e, 'signup')}>Sign Up</a></p>
              </div>
            )}
            {/* Signup Form */}
            {view === 'signup' && (
              <div id="signupForm" key="signup">
                <h3>Create an Account</h3>
                <p className="muted">Join us to easily book and manage your hostel stays.</p>
                <form onSubmit={handleSignup}>
                  <input type="text" id="signupFullName" name="fullName" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <input type="email" id="signupEmail" name="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className="form-group">
                    <label className="form-label" aria-label="I am a:">I am a:</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input type="radio" name="role" value="Student" checked={role === 'Student'} onChange={(e) => setRole(e.target.value)} />
                        Student
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="role" value="Custodian" checked={role === 'Custodian'} onChange={(e) => setRole(e.target.value)} />
                        Custodian
                      </label>
                    </div>
                  </div>
                  {role === 'Custodian' && (
                    <div className="custodian-fields-wrapper">
                      <div className="separator"><span>Hostel Information</span></div>
                      <input type="text" id="hostelName" name="hostelName" placeholder="Hostel Name" required value={hostelInfo.hostelName} onChange={(e) => setHostelInfo(p => ({...p, hostelName: e.target.value}))} />
                      <input type="tel" id="hostelContact" name="hostelContact" placeholder="Hostel Contact Number" required value={hostelInfo.hostelContact} onChange={(e) => setHostelInfo(p => ({...p, hostelContact: e.target.value}))} />
                    </div>
                  )}
                  <div className="form-group">
                    <div className="password-input-wrapper">
                      <input type={showPassword ? 'text' : 'password'} id="signupPassword" name="password" placeholder="Create Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
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
                      <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    {confirmPassword && !passwordsMatch && (
                      <div className="password-match-indicator">
                        <span style={{color: 'red', fontSize: '12px'}}><i className="fas fa-times-circle"></i> Passwords do not match</span>
                      </div>
                    )}
                    {confirmPassword && passwordsMatch && (
                      <div className="password-match-indicator">
                        <span style={{color: 'green', fontSize: '12px'}}><i className="fas fa-check-circle"></i> Passwords match</span>
                      </div>
                    )}
                  </div>
                  <button type="submit" className="btn primary full-width" disabled={!isPasswordValid || !passwordsMatch}>Create Account</button>
                </form>
                <p className="form-switcher">Already have an account? <a href="#" onClick={(e) => handleFormSwitch(e, 'login')}>Login</a></p>
              </div>
            )}
            {/* Forgot Password Form */}
            {view === 'forgotPassword' && (
              <div id="forgotPasswordForm" key="forgot">
                <h3>Reset Password</h3>
                <p className="muted">Enter your email and we'll send you a link to reset your password.</p>
                <form onSubmit={handleForgotPassword}>
                  <input type="email" id="forgotEmail" name="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <button type="submit" className="btn primary full-width">Send Reset Link</button>
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

export default AuthModal;