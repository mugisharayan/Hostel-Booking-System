import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import { AuthContext } from '../auth/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import StudentMessageCenter from '../../components/student/StudentMessageCenter';
import PaymentInquiry from '../../components/student/PaymentInquiry';
import RoomRequestForm from '../../components/student/RoomRequestForm';
import NotificationBell from '../../components/student/NotificationBell';
import SupportTicketForm from '../../components/student/SupportTicketForm';
import EmergencyContact from '../../components/student/EmergencyContact';
import StudentNotificationCenter from '../../components/student/StudentNotificationCenter';
import RoomAssignmentNotification from '../../components/notifications/RoomAssignmentNotification';
import { useNotifications } from '../../contexts/NotificationContext';
import bookingService from '../../service/booking.service';
import userService from '../../service/user.service';
import dashboardService from '../../service/dashboard.service';
import receiptService from '../../service/receipt.service';
import maintenanceService from '../../service/maintenance.service';
import communicationService from '../../service/communication.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/student-communication.css';

const DashboardPage = ({ onOpenReviewModal }) => {
  const navigate = useNavigate();
  const { userProfile, bookingHistory, login, logout, setBookingHistory } = useContext(AuthContext);
  const { notifications, markAsRead, removeNotification, getUnreadCount } = useNotifications();
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingReceipt, setDownloadingReceipt] = useState(null);
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const [isPaymentInquiryOpen, setIsPaymentInquiryOpen] = useState(false);
  const [isRoomRequestOpen, setIsRoomRequestOpen] = useState(false);
  const [isSupportTicketOpen, setIsSupportTicketOpen] = useState(false);
  const [isEmergencyContactOpen, setIsEmergencyContactOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userProfile) {
        navigate('/');
        return;
      }
      
      try {
        // Load all data from database
        const [bookings, requests] = await Promise.all([
          bookingService.getMyBookings(),
          maintenanceService.getMyMaintenanceRequests()
        ]);
        
        setBookingHistory(bookings);
        setMaintenanceRequests(requests);
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [userProfile, navigate, setBookingHistory]);

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <LoadingSpinner size="large" text="Loading Dashboard..." />
        </div>
      </main>
    );
  }
  
  if (error) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-panel active" style={{ textAlign: 'center', padding: '50px' }}>
            <i className="fa-solid fa-exclamation-triangle" style={{ fontSize: '48px', color: '#ef4444', marginBottom: '20px' }}></i>
            <h2>Error Loading Dashboard</h2>
            <p className="muted">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ padding: '10px 20px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handleDownloadReceipt = async (booking) => {
    setDownloadingReceipt(booking._id);
    try {
      const receiptData = {
        ...booking,
        hostelName: dashboardService.getHostelName(booking),
        roomName: dashboardService.getRoomName(booking),
        price: dashboardService.getRoomPrice(booking),
        studentName: userProfile?.fullName || userProfile?.name,
        studentEmail: userProfile?.email,
        studentPhone: userProfile?.phone,
        transactionId: booking.transactionId || 'BMH' + Date.now()
      };
      
      await receiptService.generateReceipt(receiptData);
    } catch (error) {
      console.error('Receipt download failed:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloadingReceipt(null);
    }
  };

  const bookings = bookingHistory || [];
  const stats = dashboardService.calculateBookingStats(bookings);
  
  // Get only active bookings (not cancelled and not expired)
  const activeBooking = bookings.find(booking => {
    const endDate = new Date(booking.endDate);
    const now = new Date();
    const status = (booking.status || 'active').toLowerCase();
    return status !== 'cancelled' && endDate > now;
  });
  
  const pastBookingsForReview = bookings.filter((booking) => {
    const endDate = new Date(booking.endDate);
    const now = new Date();
    const status = (booking.status || 'active').toLowerCase();
    return status === 'cancelled' || endDate <= now;
  });

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
          <h1 className="dashboard-hero-title">Welcome Back, <span className="dashboard-animated">{userProfile?.fullName || 'Student'}</span>!</h1>
          <p className="dashboard-hero-subtitle">Here's what's happening with your bookings today</p>
        </div>
        <div className="hero-actions">
          <button className="icon-btn" onClick={() => navigate('/')} title="Back to Home" style={{background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', cursor: 'pointer', marginRight: '10px'}}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <NotificationBell onClick={() => setIsNotificationCenterOpen(true)} />
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
              <div id="dashboard-home" className="dashboard-panel active">

              <div className="stats-grid-modern">
                <div className="stat-card-modern blue">
                  <div className="stat-icon"><i className="fa-solid fa-file-invoice"></i></div>
                  <div className="stat-info">
                    <h3>{stats.totalBookings}</h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
                <div className="stat-card-modern green">
                  <div className="stat-icon"><i className="fa-solid fa-circle-check"></i></div>
                  <div className="stat-info">
                    <h3>{stats.activeBookings}</h3>
                    <p>Active Bookings</p>
                  </div>
                </div>
                <div className="stat-card-modern purple">
                  <div className="stat-icon"><i className="fa-solid fa-wallet"></i></div>
                  <div className="stat-info">
                    <h3>{dashboardService.formatCurrency(stats.totalSpent)}</h3>
                    <p>Total Spent</p>
                  </div>
                </div>
              </div>

              {/* Room Assignment Notifications */}
              {notifications.filter(n => n.type === 'room_assignment').length > 0 && (
                <div className="room-notifications-section">
                  <h3><i className="fas fa-key"></i> Room Assignments</h3>
                  {notifications
                    .filter(n => n.type === 'room_assignment')
                    .slice(0, 3)
                    .map(notification => (
                      <RoomAssignmentNotification
                        key={notification.id}
                        notification={notification}
                        onMarkRead={markAsRead}
                        onRemove={removeNotification}
                      />
                    ))
                  }
                </div>
              )}

              <div className="alert-card-modern">
                <div className="alert-icon"><i className="fa-solid fa-bell"></i></div>
                <div className="alert-content">
                  <h4>Next Semester Bookings Opening Soon!</h4>
                  <p>Bookings for Jan 2025 - May 2025 semester open on November 1st, 2024</p>
                </div>
              </div>

              <div className="current-booking-modern">
                {activeBooking ? (
                  <>
                    <div className="booking-header-modern">
                      <h3><i className="fa-solid fa-home"></i> Current Booking</h3>
                      <span className="status-badge-modern confirmed">Active</span>
                    </div>
                    <div className="booking-card-redesign">
                      <div className="booking-main-info">
                        <div className="hostel-info">
                          <h4>{dashboardService.getHostelName(activeBooking)}</h4>
                          <p>{dashboardService.getRoomName(activeBooking)}</p>
                        </div>
                        <div className="price-badge">
                          UGX {parseInt(dashboardService.getRoomPrice(activeBooking)).toLocaleString()}
                        </div>
                      </div>
                      <div className="booking-meta">
                        <div className="meta-item">
                          <i className="fas fa-calendar-alt"></i>
                          <span>Booked: {new Date(activeBooking.createdAt || activeBooking.bookingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="booking-actions">
                          <Link to="/my-bookings" className="btn-view-details">View Details</Link>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="booking-header-modern">
                      <h3><i className="fa-solid fa-home"></i> Current Booking</h3>
                      <span className="status-badge-modern pending">No Active Booking</span>
                    </div>
                    <div style={{textAlign: 'center', padding: '40px 20px'}}>
                      <i className="fas fa-calendar-plus" style={{fontSize: '48px', color: '#cbd5e1', marginBottom: '20px'}}></i>
                      <h4 style={{color: '#64748b', marginBottom: '10px'}}>No Current Booking</h4>
                      <p className="muted" style={{marginBottom: '20px'}}>You don't have any active bookings at the moment</p>
                      <Link to="/hostels" className="btn primary">Browse Hostels</Link>
                    </div>
                  </>
                )}
              </div>

              <div className="quick-actions-modern">
                <h3>Quick Actions</h3>
                <div className="actions-grid-modern">
                  <Link to="/my-bookings" className="action-card-modern">
                    <div className="action-icon blue"><i className="fa-solid fa-file-invoice"></i></div>
                    <span>My Bookings</span>
                    <i className="fa-solid fa-arrow-right arrow"></i>
                  </Link>
                  <Link to="/maintenance" className="action-card-modern">
                    <div className="action-icon orange"><i className="fa-solid fa-screwdriver-wrench"></i></div>
                    <span>Maintenance</span>
                    <i className="fa-solid fa-arrow-right arrow"></i>
                  </Link>
                  <button onClick={() => setIsPaymentInquiryOpen(true)} className="action-card-modern">
                    <div className="action-icon green"><i className="fa-solid fa-credit-card"></i></div>
                    <span>Payment Inquiry</span>
                    <i className="fa-solid fa-arrow-right arrow"></i>
                  </button>
                  <button onClick={() => setIsRoomRequestOpen(true)} className="action-card-modern">
                    <div className="action-icon purple"><i className="fa-solid fa-door-open"></i></div>
                    <span>Room Request</span>
                    <i className="fa-solid fa-arrow-right arrow"></i>
                  </button>
                  <button onClick={() => setIsSupportTicketOpen(true)} className="action-card-modern">
                    <div className="action-icon red"><i className="fa-solid fa-life-ring"></i></div>
                    <span>Get Support</span>
                    <i className="fa-solid fa-arrow-right arrow"></i>
                  </button>
                  <Link to="/hostels" className="action-card-modern">
                    <div className="action-icon teal"><i className="fa-solid fa-search"></i></div>
                    <span>Browse Hostels</span>
                    <i className="fa-solid fa-arrow-right arrow"></i>
                  </Link>
                </div>
              </div>

              <div className="booking-history-section">
                <div className="section-header-flex">
                  <h3>Booking History</h3>
                  <Link to="/my-bookings" className="view-all-link">View All <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Hostel</th>
                        <th>Room</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 3).map((booking, index) => {
                        const hostelName = dashboardService.getHostelName(booking);
                        const roomName = dashboardService.getRoomName(booking);
                        const roomPrice = dashboardService.getRoomPrice(booking);
                        const endDate = new Date(booking.endDate);
                        const now = new Date();
                        const bookingStatus = (booking.status || 'active').toLowerCase();
                        let status = 'Active';
                        if (bookingStatus === 'cancelled') {
                          status = 'Cancelled';
                        } else if (endDate <= now) {
                          status = 'Completed';
                        }
                        
                        return (
                          <tr key={booking._id || index}>
                            <td>{hostelName}</td>
                            <td>{roomName}</td>
                            <td>{new Date(booking.createdAt || booking.bookingDate).toLocaleDateString()}</td>
                            <td>UGX {parseInt(roomPrice).toLocaleString()}</td>
                            <td><span className={`status-pill ${status.toLowerCase()}`}>{status}</span></td>
                            <td>
                              <button className="btn-icon-small" title="View Details"><i className="fa-solid fa-eye"></i></button>
                              <button 
                                className="btn-icon-small" 
                                title="Download Receipt"
                                onClick={() => handleDownloadReceipt(booking)}
                                disabled={downloadingReceipt === booking._id}
                              >
                                {downloadingReceipt === booking._id ? (
                                  <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fa-solid fa-download"></i>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {pastBookingsForReview.length > 0 && (
                <div className="review-section-modern">
                  <h3>Share Your Experience</h3>
                  <p className="muted">Help other students by reviewing your past stays</p>
                  <div className="review-list-modern">
                    {pastBookingsForReview.map((booking, index) => (
                      <div className="review-card-modern" key={index}>
                        <div className="review-info">
                          <h4>{booking.hostel}</h4>
                          <p>{booking.room}</p>
                        </div>
                        <button className="btn-review-modern" onClick={() => onOpenReviewModal(booking.hostel)}>
                          <i className="fa-solid fa-star"></i> Write Review
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="help-support-section">
                <div className="help-card">
                  <i className="fa-solid fa-circle-question"></i>
                  <h4>Need Help?</h4>
                  <p>Contact our support team for assistance</p>
                  <button className="btn-help">Get Support</button>
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
      <StudentMessageCenter
        isOpen={isMessageCenterOpen}
        onClose={() => setIsMessageCenterOpen(false)}
      />
      <PaymentInquiry
        isOpen={isPaymentInquiryOpen}
        onClose={() => setIsPaymentInquiryOpen(false)}
      />
      <RoomRequestForm
        isOpen={isRoomRequestOpen}
        onClose={() => setIsRoomRequestOpen(false)}
      />
      <SupportTicketForm
        isOpen={isSupportTicketOpen}
        onClose={() => setIsSupportTicketOpen(false)}
      />
      <EmergencyContact
        isOpen={isEmergencyContactOpen}
        onClose={() => setIsEmergencyContactOpen(false)}
      />
      <StudentNotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </>
  );
};

export default DashboardPage;