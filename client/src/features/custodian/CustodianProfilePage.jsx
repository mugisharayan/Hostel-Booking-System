import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import { AuthContext } from '../auth/AuthContext';
import custodianService from '../../service/custodian.service';
import '../../styles/modern-dashboard.css';
import '../../styles/custodian-profile-modern.css';

const CustodianProfilePage = () => {
  const { userProfile, logout, updateProfile } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Custodian',
    profilePicture: '',
  });
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    loadProfile();
  }, [userProfile]);

  const loadProfile = async () => {
    // Use AuthContext data first for instant loading
    if (userProfile) {
      setProfileData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        role: 'Custodian',
        profilePicture: userProfile.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      });
      setLoading(false);
      return;
    }

    // Fallback to API call only if no cached data
    try {
      setLoading(true);
      const response = await custodianService.getProfile();
      setProfileData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        role: 'Custodian',
        profilePicture: response.data.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('edit', '').toLowerCase();
    setProfileData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updatedData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        profilePicture: profileData.profilePicture
      };
      await custodianService.updateProfile(updatedData);
      
      // Update AuthContext to sync across all pages
      updateProfile(updatedData);
      
      showMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const result = event.target.result;
          if (typeof result === 'string' && result.startsWith('data:image/')) {
            setProfileData(prev => ({ ...prev, profilePicture: result }));
            showMessage('Profile picture updated! Remember to save changes.');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const form = e.target;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      showMessage('New passwords do not match.', 'error');
      return;
    }

    try {
      setSaving(true);
      await custodianService.changePassword({
        currentPassword,
        newPassword
      });
      showMessage('Password updated successfully!');
      form.reset();
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setSaving(false);
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
    // showToast('Notification preferences saved!');
  };

  const handleDarkModeToggle = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleProfilePicClick = () => {
    document.getElementById('profilePicInput').click();
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-panel active" style={{ textAlign: 'center', padding: '50px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#0ea5e9', marginBottom: '20px' }}></i>
            <h2>Loading Profile...</h2>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <section className="custodian-hero">
        <div className="floating-icons">
          <i className="fa-solid fa-user floating-icon-1"></i>
          <i className="fa-solid fa-user-gear floating-icon-2"></i>
          <i className="fa-solid fa-id-card floating-icon-3"></i>
          <i className="fa-solid fa-user-shield floating-icon-4"></i>
          <i className="fa-solid fa-user-cog floating-icon-5"></i>
          <i className="fa-solid fa-address-card floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>My <span className="dashboard-animated">Profile</span></h1>
          <p>Manage your personal information and account settings</p>
        </div>
      </section>
      
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-layout">
            <DashboardSidebar
              user={{ fullName: profileData.name, course: profileData.role, profilePicture: profileData.profilePicture }}
              role="custodian"
              onLogout={() => setIsLogoutModalOpen(true)}
            />
            <div className="dashboard-content">
              {message.text && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '20px' }}>
                  {message.text}
                </div>
              )}
              <div className="modern-dashboard-container">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                  <div className="profile-header-content">
                    <div className="profile-avatar-section">
                      <div className="profile-avatar-wrapper" onClick={handleProfilePicClick}>
                        <img src={profileData.profilePicture} alt="Profile" className="profile-avatar" />
                        <div className="avatar-edit-overlay">
                          <i className="fas fa-camera"></i>
                        </div>
                        <input type="file" id="profilePicInput" style={{ display: 'none' }} accept="image/*" onChange={handleProfilePicChange} />
                      </div>
                    </div>
                    <div className="profile-info-section">
                      <div className="profile-name-row">
                        <h2 className="profile-name">{profileData.name}</h2>
                        <button className="edit-profile-btn" onClick={handleEditProfile} disabled={isEditing}>
                          <i className="fas fa-edit"></i> Edit Profile
                        </button>
                      </div>
                      <p className="profile-role">{profileData.role}</p>
                      <div className="profile-contact">
                        <i className="fas fa-envelope"></i>
                        <span>{profileData.email}</span>
                      </div>
                      {profileData.phone && (
                        <div className="profile-contact">
                          <i className="fas fa-phone"></i>
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Settings Grid */}
                <div className="profile-settings-grid">
                  {/* Personal Information */}
                  <div className="settings-card">
                    <div className="settings-card-header">
                      <div className="settings-icon">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="settings-title">
                        <h3>Personal Information</h3>
                        <p>Update your personal details</p>
                      </div>
                    </div>
                    {isEditing ? (
                      <form className="settings-form" onSubmit={handleSaveProfile}>
                        <div className="form-group">
                          <label>Full Name</label>
                          <input type="text" id="editName" value={profileData.name} onChange={handleEditChange} required />
                        </div>
                        <div className="form-group">
                          <label>Email Address</label>
                          <input type="email" id="editEmail" value={profileData.email} onChange={handleEditChange} required />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input type="tel" id="editPhone" value={profileData.phone} onChange={handleEditChange} placeholder="+256 700 000 000" />
                        </div>
                        <div className="form-group">
                          <label>Role</label>
                          <input type="text" id="editRole" value={profileData.role} readOnly className="readonly" />
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="btn primary" disabled={saving}>
                            <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i> 
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button type="button" className="btn outline" onClick={handleCancelEdit} disabled={saving}>
                            <i className="fas fa-times"></i> Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="settings-content">
                        <div className="info-row">
                          <span className="info-label">Full Name</span>
                          <span className="info-value">{profileData.name}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Email</span>
                          <span className="info-value">{profileData.email}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Phone</span>
                          <span className="info-value">{profileData.phone || 'Not provided'}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Role</span>
                          <span className="info-value">{profileData.role}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Security Settings */}
                  <div className="settings-card">
                    <div className="settings-card-header">
                      <div className="settings-icon">
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div className="settings-title">
                        <h3>Security</h3>
                        <p>Manage your password and security</p>
                      </div>
                    </div>
                    <form className="settings-form" onSubmit={handlePasswordChange}>
                      <div className="form-group">
                        <label>Current Password</label>
                        <div className="password-input">
                          <input type="password" name="currentPassword" required />
                          <i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>New Password</label>
                        <div className="password-input">
                          <input type="password" name="newPassword" required />
                          <i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <div className="password-input">
                          <input type="password" name="confirmPassword" required />
                          <i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i>
                        </div>
                      </div>
                      <button type="submit" className="btn primary" disabled={saving}>
                        <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-key'}`}></i> 
                        {saving ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>

                  {/* Preferences */}
                  <div className="settings-card">
                    <div className="settings-card-header">
                      <div className="settings-icon">
                        <i className="fas fa-cog"></i>
                      </div>
                      <div className="settings-title">
                        <h3>Preferences</h3>
                        <p>Customize your experience</p>
                      </div>
                    </div>
                    <div className="settings-content">
                      <div className="preference-item">
                        <div className="preference-info">
                          <h4>Dark Mode</h4>
                          <p>Reduce eye strain in low-light conditions</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="settings-card">
                    <div className="settings-card-header">
                      <div className="settings-icon">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <div className="settings-title">
                        <h3>Account Activity</h3>
                        <p>Your account statistics</p>
                      </div>
                    </div>
                    <div className="settings-content">
                      <div className="stats-grid">
                        <div className="stat-item">
                          <div className="stat-value">156</div>
                          <div className="stat-label">Rooms Managed</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">42</div>
                          <div className="stat-label">Maintenance Tasks</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">8</div>
                          <div className="stat-label">Months Active</div>
                        </div>
                      </div>
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

export default CustodianProfilePage;