import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import CustodianMessageCenter from '../../components/messaging/CustodianMessageCenter';
import CustodianNotificationBell from '../../components/custodian/CustodianNotificationBell';
import CustodianNotificationCenter from '../../components/custodian/CustodianNotificationCenter';
import SupportTicketSystem from '../../components/support/SupportTicketSystem';
import StudentDirectory from '../../components/communication/StudentDirectory';
import PaymentReminder from '../../components/communication/PaymentReminder';
import BookingManagement from '../../components/booking/BookingManagement';
import RoomLevelManager from '../../components/hostel/RoomLevelManager';
import IntegrationPanel from '../../components/integrations/IntegrationPanel';
import { AuthContext } from '../auth/AuthContext';
import { useCustodian } from '../../contexts/CustodianContext';
import HostelCreationModal from '../../components/custodian/HostelCreationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/modern-dashboard.css';
import '../../styles/mobile-responsive.css';
import '../../styles/minimalist-dashboard.css';
import '../../styles/communication-components.css';
import '../../styles/custodian-modern.css';
import '../../styles/hostel-creation.css';

const CustodianDashboardPage = () => {
  const navigate = useNavigate();
  const { userProfile, logout, loading } = useContext(AuthContext);
  const { hostelData, analytics, bookings, payments, rooms, roomStats, loadDashboardData } = useCustodian();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hasHostel, setHasHostel] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isSupportTicketOpen, setIsSupportTicketOpen] = useState(false);
  const [isStudentDirectoryOpen, setIsStudentDirectoryOpen] = useState(false);
  const [isPaymentReminderOpen, setIsPaymentReminderOpen] = useState(false);
  const [isBookingManagementOpen, setIsBookingManagementOpen] = useState(false);
  const [isRoomManagerOpen, setIsRoomManagerOpen] = useState(false);
  const [isIntegrationPanelOpen, setIsIntegrationPanelOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isLoading, setIsLoading] = useState(true);

  // Check if custodian has hostel on mount - ONLY ONCE
  useEffect(() => {
    const checkHostelStatus = async () => {
      setIsLoading(true);
      try {
        const response = await loadDashboardData();
        if (response && response.hostel) {
          setHasHostel(true);
        } else {
          setHasHostel(false);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setHasHostel(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkHostelStatus();
  }, []); // Empty dependency array - run only once

  // Update hasHostel when hostelData changes
  useEffect(() => {
    if (hostelData) {
      setHasHostel(true);
    }
  }, [hostelData]);

  // Handle theme changes
  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode);
  }, [darkMode]);

  if (loading || !userProfile || isLoading) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <LoadingSpinner size="large" text="Loading Dashboard..." />
        </div>
      </main>
    );
  }

  const custodianProfile = {
    fullName: userProfile?.name || 'Custodian',
    course: userProfile?.role || 'Custodian',
    profilePicture: userProfile?.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleCreateSuccess = () => {
    setHasHostel(true);
    setShowCreateModal(false);
    // Reload dashboard data
    loadDashboardData();
  };

  return (
    <>
      <section className="custodian-hero">
        <div className="hero-content">
          <h1>Welcome back, <span className="dashboard-animated">{userProfile?.name || 'Custodian'}</span></h1>
          <p>Manage hostel operations and oversee daily activities</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => navigate('/')} title="Back to Home">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button className="icon-btn" onClick={toggleTheme} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <CustodianNotificationBell onClick={() => setIsNotificationCenterOpen(true)} />
        </div>
      </section>
      
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-layout">
            <DashboardSidebar
              user={custodianProfile}
              role="custodian"
              onLogout={() => setIsLogoutModalOpen(true)}
            />
            <div className="dashboard-content">
              <div className="modern-dashboard-container">
                {!hasHostel ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <i className="fas fa-plus-circle" style={{ fontSize: '64px', color: '#0ea5e9', marginBottom: '20px' }}></i>
                    <h2>Create Your Hostel</h2>
                    <p style={{ marginBottom: '30px', color: '#64748b' }}>
                      Set up your hostel profile to start managing bookings, payments, and analytics.
                    </p>
                    <button 
                      type="button"
                      className="btn primary" 
                      onClick={() => setShowCreateModal(true)}
                      style={{ padding: '15px 30px', fontSize: '16px' }}
                    >
                      <i className="fas fa-plus"></i> Create Hostel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="hostel-info-card" style={{ marginBottom: '20px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>
                        <i className="fas fa-building" style={{ marginRight: '8px', color: '#0ea5e9' }}></i>
                        {hostelData?.name}
                      </h3>
                      <p style={{ margin: '0', color: '#64748b' }}>
                        <i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>
                        {hostelData?.location} • {bookings?.length || 0} bookings • {payments?.length || 0} payments
                      </p>
                    </div>
                    <div className="stats-grid-compact">
                      <div className="stat-card-compact blue">
                        <div className="stat-icon"><i className="fa-solid fa-door-open"></i></div>
                        <div className="stat-info">
                          <h3>{roomStats?.total || rooms?.length || 0}</h3>
                          <p>Total Rooms</p>
                          <div className="stat-trend">{roomStats?.occupied || 0} occupied</div>
                        </div>
                      </div>
                      <div className="stat-card-compact green">
                        <div className="stat-icon"><i className="fa-solid fa-money-bill-wave"></i></div>
                        <div className="stat-info">
                          <h3>UGX {analytics?.totalRevenue ? (analytics.totalRevenue / 1000000).toFixed(1) : 0}M</h3>
                          <p>Total Revenue</p>
                          <div className="stat-trend positive">UGX {analytics?.monthlyRevenue?.toLocaleString() || 0} this month</div>
                        </div>
                      </div>
                      <div className="stat-card-compact orange">
                        <div className="stat-icon"><i className="fa-solid fa-bed"></i></div>
                        <div className="stat-info">
                          <h3>{bookings?.length || 0}</h3>
                          <p>Active Bookings</p>
                          <div className="stat-trend">{roomStats?.available || 0} rooms available</div>
                        </div>
                      </div>
                      <div className="stat-card-compact purple">
                        <div className="stat-icon"><i className="fa-solid fa-credit-card"></i></div>
                        <div className="stat-info">
                          <h3>{payments?.filter(p => p.status === 'Completed')?.length || 0}</h3>
                          <p>Payments</p>
                          <div className="stat-trend">{payments?.filter(p => p.status === 'Pending')?.length || 0} pending</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="quick-actions-compact">
                  <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
                  <div className="actions-grid-compact">
                    <Link to="/custodian-payment-management" className="action-card-compact">
                      <div className="action-icon green"><i className="fa-solid fa-credit-card"></i></div>
                      <span>Payments</span>
                    </Link>
                    <Link to="/custodian-room-management" className="action-card-compact">
                      <div className="action-icon orange"><i className="fa-solid fa-door-open"></i></div>
                      <span>Rooms</span>
                    </Link>
                    <Link to="/custodian-analytics" className="action-card-compact">
                      <div className="action-icon purple"><i className="fa-solid fa-chart-line"></i></div>
                      <span>Analytics</span>
                    </Link>
                  </div>
                </div>

                <div className="content-single">
                  <div className="recent-activity-compact">
                    <div className="section-header-compact">
                      <h3><i className="fas fa-users"></i> Recent Bookings</h3>
                      <Link to="/custodian-room-assignment" className="view-all-link">View All</Link>
                    </div>
                    <div className="activity-list-compact">
                      {bookings && bookings.length > 0 ? (
                        bookings.slice(0, 3).map((booking, index) => (
                          <div key={booking.id || index} className="activity-item-compact">
                            <div className={`activity-dot ${booking.status === 'active' ? 'booking' : booking.status === 'pending' ? 'pending' : 'cancelled'}`}></div>
                            <div className="activity-content">
                              <h5>{booking.student?.name || 'Student'} - {booking.roomName || booking.room?.name}</h5>
                              <span className="activity-time">
                                {booking.status} • {new Date(booking.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="activity-item-compact">
                          <div className="activity-dot empty"></div>
                          <div className="activity-content">
                            <h5>No bookings yet</h5>
                            <span className="activity-time">Waiting for first booking</span>
                          </div>
                        </div>
                      )}
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
      <CustodianMessageCenter 
        isOpen={isMessageCenterOpen}
        onClose={() => setIsMessageCenterOpen(false)}
      />
      <CustodianNotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
      <SupportTicketSystem 
        isOpen={isSupportTicketOpen}
        onClose={() => setIsSupportTicketOpen(false)}
      />
      <StudentDirectory 
        isOpen={isStudentDirectoryOpen}
        onClose={() => setIsStudentDirectoryOpen(false)}
      />
      <PaymentReminder 
        isOpen={isPaymentReminderOpen}
        onClose={() => setIsPaymentReminderOpen(false)}
      />
      <BookingManagement 
        isOpen={isBookingManagementOpen}
        onClose={() => setIsBookingManagementOpen(false)}
      />
      <RoomLevelManager 
        isOpen={isRoomManagerOpen}
        onClose={() => setIsRoomManagerOpen(false)}
      />
      <IntegrationPanel 
        isOpen={isIntegrationPanelOpen}
        onClose={() => setIsIntegrationPanelOpen(false)}
      />
      <HostelCreationModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default CustodianDashboardPage;