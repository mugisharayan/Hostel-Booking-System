import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import { AuthContext } from '../auth/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import maintenanceService from '../../service/maintenance.service';

const MaintenancePage = () => {
  const navigate = useNavigate();
  const { userProfile, login, logout } = useContext(AuthContext);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMaintenanceRequests = async () => {
    if (!userProfile) {
      navigate('/');
      return;
    }
    
    try {
      const requests = await maintenanceService.getMyMaintenanceRequests();
      setMaintenanceRequests(requests);
    } catch (error) {
      setError('Failed to load maintenance requests');
      console.error('Maintenance requests load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMaintenanceRequests();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadMaintenanceRequests, 30000);
    
    return () => clearInterval(interval);
  }, [userProfile, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('No file chosen');
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const form = e.target;
    const requestData = {
      category: form.issueCategory.value,
      roomNumber: form.roomNumber.value,
      description: form.issueDescription.value,
    };

    try {
      const newRequest = await maintenanceService.createMaintenanceRequest(requestData);
      setMaintenanceRequests([newRequest, ...maintenanceRequests]);
      form.reset();
      setFileName('No file chosen');
    } catch (error) {
      setError(error.message || 'Failed to submit maintenance request');
    } finally {
      setIsSubmitting(false);
    }
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
            <h2>Loading Maintenance...</h2>
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
          <h1 className="dashboard-hero-title">Maintenance <span className="dashboard-animated">Requests</span></h1>
          <p className="dashboard-hero-subtitle">Report and track issues with your room or hostel facilities</p>
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
              <div id="maintenance" className="dashboard-panel active">
              
              {/* Maintenance Statistics */}
              <div className="stats-grid-modern" style={{marginBottom: '30px'}}>
                <div className="stat-card-modern orange">
                  <div className="stat-icon"><i className="fas fa-tools"></i></div>
                  <div className="stat-info">
                    <h3>{maintenanceRequests.filter(r => r.status === 'Pending').length}</h3>
                    <p>Pending</p>
                  </div>
                </div>
                <div className="stat-card-modern blue">
                  <div className="stat-icon"><i className="fas fa-cog"></i></div>
                  <div className="stat-info">
                    <h3>{maintenanceRequests.filter(r => r.status === 'In Progress').length}</h3>
                    <p>In Progress</p>
                  </div>
                </div>
                <div className="stat-card-modern green">
                  <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                  <div className="stat-info">
                    <h3>{maintenanceRequests.filter(r => r.status === 'Resolved').length}</h3>
                    <p>Resolved</p>
                  </div>
                </div>
              </div>

              <div className="maintenance-form-card">
                <div className="section-header">
                  <h3><i className="fas fa-plus-circle"></i> Submit New Request</h3>
                  <p className="muted">Report any issues with your room or facilities</p>
                </div>
                {error && (
                  <div className="error-message" style={{background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px'}}>
                    <i className="fa-solid fa-exclamation-triangle"></i> {error}
                  </div>
                )}
                <form className="maintenance-form-modern" onSubmit={handleSubmitRequest}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="issueCategory" aria-label="Category">Category</label>
                      <select id="issueCategory" name="issueCategory" required>
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="furniture">Furniture</option>
                        <option value="internet">Wi-Fi/Internet</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="roomNumber" aria-label="Room Number">Room Number</label>
                      <input type="text" id="roomNumber" name="roomNumber" placeholder="e.g., A-25" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="issueDescription" aria-label="Describe the Issue">Describe the Issue</label>
                    <textarea id="issueDescription" name="issueDescription" rows="4" placeholder="Please provide as much detail as possible..." required></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="issuePhoto" aria-label="Upload a Photo (Optional)">Upload a Photo (Optional)</label>
                    <div className="file-upload-wrapper">
                      <input type="file" id="issuePhoto" name="issuePhoto" className="file-input" accept="image/*" onChange={handleFileChange} />
                      <label htmlFor="issuePhoto" className="file-upload-label">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <span>Choose File</span>
                      </label>
                      <span className="file-name-display">{fileName}</span>
                    </div>
                  </div>
                  <button type="submit" className="btn primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><i className="fa-solid fa-spinner fa-spin"></i> Submitting...</>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </form>
              </div>

              <div className="maintenance-history-section">
                <div className="section-header">
                  <h3><i className="fas fa-history"></i> Request History</h3>
                </div>
                <div className="maintenance-requests-grid">
                  {maintenanceRequests.length === 0 ? (
                    <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px'}}>
                      <i className="fas fa-clipboard-list" style={{fontSize: '64px', color: '#cbd5e1', marginBottom: '20px'}}></i>
                      <h3 style={{color: '#64748b', marginBottom: '10px'}}>No Requests Yet</h3>
                      <p className="muted">Submit your first maintenance request above</p>
                    </div>
                  ) : (
                    maintenanceRequests.map((req, index) => (
                      <div className="maintenance-request-card" key={req._id || index}>
                        <div className="request-card-header">
                          <div className="request-icon">
                            <i className={`fas fa-${req.category === 'plumbing' ? 'faucet' : req.category === 'electrical' ? 'bolt' : req.category === 'furniture' ? 'couch' : req.category === 'internet' ? 'wifi' : 'wrench'}`}></i>
                          </div>
                          <span className={`status-badge-modern ${req.status.toLowerCase().replace(' ', '-')}`}>{req.status}</span>
                        </div>
                        <div className="request-card-body">
                          <h4>{req.category.charAt(0).toUpperCase() + req.category.slice(1)}</h4>
                          <div className="request-detail-row">
                            <i className="fas fa-door-open"></i>
                            <span>Room {req.roomNumber}</span>
                          </div>
                          <div className="request-detail-row">
                            <i className="fas fa-calendar"></i>
                            <span>{new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <p className="request-description">{req.description}</p>
                          {req.custodianNotes && (
                            <div className="custodian-notes">
                              <i className="fas fa-comment"></i>
                              <span>Custodian: {req.custodianNotes}</span>
                            </div>
                          )}
                        </div>
                        <div className="request-actions">
                          <button className="btn-small primary" onClick={() => setIsMessageCenterOpen(true)}>
                            <i className="fas fa-comments"></i> Chat
                          </button>
                          {req.status !== 'Resolved' && (
                            <button className="btn-small secondary">
                              <i className="fas fa-camera"></i> Add Photo
                            </button>
                          )}
                        </div>
                        <div className="request-progress-bar">
                          <div className="progress-step" style={{width: req.status === 'Pending' ? '33%' : req.status === 'In Progress' ? '66%' : '100%'}}></div>
                        </div>
                      </div>
                    ))
                  )}
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

export default MaintenancePage;