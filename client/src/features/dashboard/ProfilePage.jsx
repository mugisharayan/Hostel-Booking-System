import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from './DashboardSidebar';
import { AuthContext } from '../auth/AuthContext';
import userService from '../../service/user.service';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userProfile, loginWithUserData, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(userProfile || {});
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!userProfile) {
        const storedAuth = JSON.parse(localStorage.getItem('auth'));
        if (storedAuth && storedAuth.token) {
          try {
            const profile = await userService.getUserProfile();
            loginWithUserData({ ...storedAuth, ...profile });
            setEditFormData(profile);
          } catch (error) {
            console.error('Failed to load profile:', error);
            navigate('/');
          }
        } else {
          navigate('/');
        }
      } else {
        setEditFormData(userProfile);
      }
    };
    loadProfile();
  }, [userProfile, navigate, loginWithUserData]);

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const updatedProfile = await userService.updateUserProfile(editFormData);
      const auth = JSON.parse(localStorage.getItem('auth'));
      const newUserData = { ...auth, ...updatedProfile };
      loginWithUserData(newUserData);
      setEditFormData(updatedProfile);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async function(event) {
          const result = event.target.result;
          if (typeof result === 'string' && result.startsWith('data:image/')) {
            try {
              setIsLoading(true);
              const updatedProfile = await userService.updateUserProfile({ profilePicture: result });
              const auth = JSON.parse(localStorage.getItem('auth'));
              const newUserData = { ...auth, ...updatedProfile };
              loginWithUserData(newUserData);
              setSuccess('Profile picture updated!');
              setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
              setError(error.message || 'Failed to update profile picture');
            } finally {
              setIsLoading(false);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const form = e.target;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      setSuccess('Password updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      form.reset();
    } catch (error) {
      setError(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (e) => {
    const passwordInput = e.target.previousElementSibling;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      e.target.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
      passwordInput.type = 'password';
      e.target.classList.replace('fa-eye', 'fa-eye-slash');
    }
  };

  const handleNotificationSave = (e) => {
    e.preventDefault();
    // Save notification preferences (e.g., to userProfile in localStorage or backend)
    // showToast('Notification preferences saved!');
  };

  const handleProfilePicClick = () => {
    document.getElementById('profilePicInput').click();
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  if (!userProfile) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-panel active" style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading Profile...</h2>
            <p className="muted">Please wait while we fetch your data.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <section className="dashboard-hero-section">
        <div className="floating-home-icons">
          <i className="fa-solid fa-home floating-home-1"></i>
          <i className="fa-solid fa-home floating-home-2"></i>
          <i className="fa-solid fa-home floating-home-3"></i>
          <i className="fa-solid fa-home floating-home-4"></i>
          <i className="fa-solid fa-home floating-home-5"></i>
          <i className="fa-solid fa-home floating-home-6"></i>
        </div>
        <div className="dashboard-hero-container">
          <h1 className="dashboard-hero-title">My <span className="dashboard-animated">Profile</span></h1>
          <p className="dashboard-hero-subtitle">Manage your personal information and account settings</p>
        </div>
      </section>
      
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-layout">
            <DashboardSidebar
              user={userProfile}
              role="student"
              onLogout={() => setIsLogoutModalOpen(true)}
            />

            <div className="dashboard-content">
              <div id="profile" className="dashboard-panel active">
              <div className="profile-content-modern">
                <div className="profile-info-card-modern">
                  <div className="profile-card-header-modern">
                    <div>
                      <h3><i className="fas fa-user-circle"></i> Profile Information</h3>
                      <p className="muted">Manage your personal details</p>
                    </div>
                    <button className="btn-edit-modern" onClick={() => setIsEditing(true)} style={{ display: isEditing ? 'none' : 'flex' }}><i className="fas fa-pen"></i> Edit Profile</button>
                  </div>
                  {error && (
                    <div className="error-message" style={{background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', margin: '20px'}}>
                      <i className="fa-solid fa-exclamation-triangle"></i> {error}
                    </div>
                  )}
                  {success && (
                    <div className="success-message" style={{background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', margin: '20px'}}>
                      <i className="fa-solid fa-check-circle"></i> {success}
                    </div>
                  )}
                  <div className="profile-card-content-modern">
                    <div className="profile-pic-modern-wrapper" onClick={handleProfilePicClick}>
                      <div className="profile-pic-circle">
                        <img 
                          src={userProfile.profilePicture || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='75' fill='%23f0f0f0'/%3E%3Cpath d='M75 45c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 90c-25 0-45-12-45-27 0-15 20-27 45-27s45 12 45 27c0 15-20 27-45 27z' fill='%23ccc'/%3E%3C/svg%3E"} 
                          alt="Profile picture"
                        />
                        <div className="edit-overlay-modern"><i className="fas fa-camera"></i></div>
                      </div>
                      <input type="file" id="profilePicInput" style={{ display: 'none' }} accept="image/*" onChange={handleProfilePicChange} />
                    </div>
                    <div className="profile-details-modern">
                      {!isEditing ? (
                        <div className="profile-info-grid">
                          <div className="info-item-modern"><i className="fas fa-user"></i><div><small>Full Name</small><p>{userProfile.fullName}</p></div></div>
                          <div className="info-item-modern"><i className="fas fa-envelope"></i><div><small>Email Address</small><p>{userProfile.email}</p></div></div>
                          <div className="info-item-modern"><i className="fas fa-phone"></i><div><small>Phone Number</small><p>{userProfile.phone || 'N/A'}</p></div></div>
                          <div className="info-item-modern"><i className="fas fa-graduation-cap"></i><div><small>Course / Program</small><p>{userProfile.course}</p></div></div>
                        </div>
                      ) : (
                        <form className="profile-edit-form-modern" onSubmit={handleSaveProfile}>
                          <div className="form-group-modern"><label><i className="fas fa-user"></i> Full Name</label><input type="text" id="fullName" required value={editFormData.fullName} onChange={handleEditChange} /></div>
                          <div className="form-group-modern"><label><i className="fas fa-envelope"></i> Email Address</label><input type="email" id="email" required value={editFormData.email} onChange={handleEditChange} /></div>
                          <div className="form-group-modern"><label><i className="fas fa-phone"></i> Phone Number</label><input type="tel" id="phone" required value={editFormData.phone} onChange={handleEditChange} /></div>
                          <div className="form-group-modern"><label><i className="fas fa-graduation-cap"></i> Course / Program</label><input type="text" id="course" required value={editFormData.course} onChange={handleEditChange} /></div>
                          <div className="form-actions-modern">
                            <button type="submit" className="btn-save-modern" disabled={isLoading}>
                              {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-check"></i> Save Changes</>}
                            </button>
                            <button type="button" className="btn-cancel-modern" onClick={() => setIsEditing(false)} disabled={isLoading}><i className="fas fa-times"></i> Cancel</button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                <div className="profile-sections-grid">
                  <div className="security-card-modern">
                    <div className="card-header-modern"><h3><i className="fas fa-shield-alt"></i> Security Settings</h3><p className="muted">Manage your account security</p></div>
                    <div className="security-sections-wrapper">
                      <div className="security-section">
                        <div className="security-section-header"><h4>Change Password</h4><small className="muted">Last updated: 6 months ago</small></div>
                        <form id="password-change-form" onSubmit={handlePasswordChange}>
                          <div className="form-group"><label htmlFor="currentPassword" aria-label="Current Password">Current Password</label><div className="password-wrapper"><input type="password" id="currentPassword" name="currentPassword" required /><i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i></div></div>
                          <div className="form-group"><label htmlFor="newPassword" aria-label="New Password">New Password</label><div className="password-wrapper"><input type="password" id="newPassword" name="newPassword" required /><i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i></div></div>
                          <div className="form-group"><label htmlFor="confirmPassword" aria-label="Confirm New Password">Confirm New Password</label><div className="password-wrapper"><input type="password" id="confirmPassword" name="confirmPassword" required /><i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i></div></div>
                          <button type="submit" className="btn primary" style={{ marginTop: '10px' }} disabled={isLoading}>
                            {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : 'Update Password'}
                          </button>
                        </form>
                      </div>
                      <div className="security-section">
                        <div className="security-section-header"><h4>Login History</h4></div>
                        <ul className="login-history-list">
                          <li><i className="fas fa-desktop"></i><div><strong>Kampala, UG</strong><small>Chrome on Windows - 1 hour ago</small></div></li>
                        </ul>
                        <a href="#" className="link-primary">View all login activity</a>
                      </div>
                    </div>
                  </div>

                  <div className="notifications-card-modern">
                    <div className="card-header-modern"><h3><i className="fas fa-bell"></i> Notification Preferences</h3><p className="muted">Choose how you receive updates</p></div>
                    <form id="notification-settings-form" onSubmit={handleNotificationSave}>
                      <p className="muted" style={{ marginBottom: '20px' }}>Select how you want to receive notifications.</p>
                      <div className="notification-table">
                        <div className="notification-table-header">
                          <span>Activity</span>
                          <div className="channels"><span>Email</span><span>Push</span></div>
                        </div>
                        <div className="notification-row">
                          <div className="notification-info">
                            <strong>Booking Confirmations</strong>
                            <p className="muted">When your booking is confirmed or cancelled.</p>
                          </div>
                          <div className="notification-channels">
                            <label className="custom-checkbox"><input type="checkbox" defaultChecked /><span></span></label>
                            <label className="custom-checkbox"><input type="checkbox" defaultChecked /><span></span></label>
                          </div>
                        </div>
                        <div className="notification-row">
                          <div className="notification-info">
                            <strong>Maintenance Updates</strong>
                            <p className="muted">On the status of your maintenance requests.</p>
                          </div>
                          <div className="notification-channels">
                            <label className="custom-checkbox"><input type="checkbox" defaultChecked /><span></span></label>
                            <label className="custom-checkbox"><input type="checkbox" /><span></span></label>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="btn primary" style={{ marginTop: '20px' }}>Save Preferences</button>
                    </form>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default ProfilePage;