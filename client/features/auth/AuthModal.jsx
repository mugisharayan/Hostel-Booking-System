import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgotPassword', 'verifyEmail'
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student'); // Add role state, default to student
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

  const handleSignup = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (!isPasswordValid) {
      showToast('Please ensure your password meets all requirements.', true);
      return;
    }

    if (userExists) {
      showToast('An account with this email already exists.', true);
      return;
    }

    const newUser = {
      fullName,
      email,
      password, // In a real app, this should be hashed!
      profilePicture: '',
      course: role === 'custodian' ? 'Custodian' : 'Not set', // Set a default title for custodian
      role: role, // Add the selected role
      ...(role === 'custodian' && { hostelInfo }), // Conditionally add hostel info
      isVerified: false, // Add verification flag
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Simulate sending a verification email
    console.log(`
      --- SIMULATED VERIFICATION EMAIL ---
      To: ${email}
      Subject: Verify Your BookMyHostel Account
      
      Thank you for signing up! Please verify your email to activate your account.
      In this demo, click the "Simulate Email Verification" button in the modal.
      --- END OF SIMULATED EMAIL ---
    `);

    setView('verifyEmail'); // Switch to the verification view
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      if (!user.isVerified) {
        showToast('Please verify your email before logging in.', true);
        setView('verifyEmail'); // Guide user to verification
        return;
      }
      const userBookings = JSON.parse(localStorage.getItem('bookingHistory')) || [];
      login(user, userBookings);
      showToast('Logged in successfully!');
      // If the user is a custodian, redirect them to their dashboard
      if (user.role === 'custodian') {
        navigate('/custodian-dashboard');
      }
      onClose();
    } else {
      showToast('Invalid email or password.', true);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log(`Password reset requested for: ${email}`);
    showToast('If an account with this email exists, a password reset link has been sent.');
    onClose();
  };

  // This function simulates the user clicking a link in their email
  const handleSimulateVerification = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex > -1) {
      users[userIndex].isVerified = true;
      localStorage.setItem('users', JSON.stringify(users));
      showToast('Email verified successfully! You can now log in.');
      setView('login');
    } else {
      showToast('Could not find user to verify. Please sign up again.', true);
      setView('signup');
    }
  };

  if (!isOpen) return null;

  const handleFormSwitch = (e, type) => {
    e.preventDefault();
    setView(type);
    setEmail('');
    setPassword('');
    setFullName('');
    setPasswordValidations({ length: false, uppercase: false, lowercase: false, number: false, specialChar: false });
    setHostelInfo({ hostelName: '', hostelContact: '' });
    setRole('student'); // Reset role on switch
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
                  <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
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
                  <input type="text" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className="form-group">
                    <label className="form-label">I am a:</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input type="radio" name="role" value="student" checked={role === 'student'} onChange={(e) => setRole(e.target.value)} />
                        Student
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="role" value="custodian" checked={role === 'custodian'} onChange={(e) => setRole(e.target.value)} />
                        Custodian
                      </label>
                    </div>
                  </div>
                  {role === 'custodian' && (
                    <div className="custodian-fields-wrapper">
                      <div className="separator"><span>Hostel Information</span></div>
                      <input type="text" name="hostelName" placeholder="Hostel Name" required value={hostelInfo.hostelName} onChange={(e) => setHostelInfo(p => ({...p, hostelName: e.target.value}))} />
                      <input type="tel" name="hostelContact" placeholder="Hostel Contact Number" required value={hostelInfo.hostelContact} onChange={(e) => setHostelInfo(p => ({...p, hostelContact: e.target.value}))} />
                    </div>
                  )}
                  <div className="form-group">
                    <input type="password" placeholder="Create Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
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
                  <button type="submit" className="btn primary full-width" disabled={!isPasswordValid}>Create Account</button>
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
                  <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <button type="submit" className="btn primary full-width">Send Reset Link</button>
                </form>
                <p className="form-switcher">Remember your password? <a href="#" onClick={(e) => handleFormSwitch(e, 'login')}>Back to Login</a></p>
              </div>
            )}
            {/* Verify Email View */}
            {view === 'verifyEmail' && (
              <div id="verifyEmailView" key="verify">
                <h3>Check Your Email</h3>
                <p className="muted">We've sent a verification link to <strong>{email}</strong>. Please check your inbox to activate your account.</p>
                <p className="form-note">For this demo, a "verification email" was logged to the console. Click the button below to simulate verifying.</p>
                <button className="btn primary full-width" onClick={handleSimulateVerification}>Simulate Email Verification</button>
                <p className="form-switcher">
                  <a href="#" onClick={(e) => handleFormSwitch(e, 'login')}>Back to Login</a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;