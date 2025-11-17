import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import CancelBookingModal from '../../components/modals/CancelBookingModal';
import ReviewModal from '../../components/modals/ReviewModal';
import { AuthContext } from '../auth/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import bookingService from '../../service/booking.service';
import dashboardService from '../../service/dashboard.service';
import receiptService from '../../service/receipt.service';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { userProfile, bookingHistory, logout, setBookingHistory } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingReceipt, setDownloadingReceipt] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [bookingToReview, setBookingToReview] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      if (!userProfile) {
        navigate('/');
        return;
      }
      
      try {
        const bookings = await bookingService.getMyBookings();
        setBookingHistory(bookings);
      } catch (error) {
        setError('Failed to load bookings');
        console.error('Bookings load error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookings();
  }, [userProfile, navigate, setBookingHistory]);

  const handleCancelBooking = async (reason) => {
    try {
      await bookingService.cancelBooking(bookingToCancel._id, reason);
      
      // Update local state
      const updatedBookings = bookingHistory.map(booking => 
        booking._id === bookingToCancel._id 
          ? { ...booking, status: 'cancelled', cancellationReason: reason }
          : booking
      );
      setBookingHistory(updatedBookings);
    } catch (error) {
      setError('Failed to cancel booking: ' + error.message);
    }
  };

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const openReviewModal = (booking) => {
    const enrichedBooking = {
      ...booking,
      hostelName: dashboardService.getHostelName(booking),
      roomName: dashboardService.getRoomName(booking)
    };
    setBookingToReview(enrichedBooking);
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = (success) => {
    setReviewModalOpen(false);
    setBookingToReview(null);
    if (success) {
      alert('Thank you for your review!');
    }
  };

  const handleDownloadReceipt = async (booking, index) => {
    setDownloadingReceipt(index);
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

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-panel active" style={{ textAlign: 'center', padding: '50px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#0ea5e9', marginBottom: '20px' }}></i>
            <h2>Loading Bookings...</h2>
            <p className="muted">Please wait while we fetch your data.</p>
          </div>
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
            <h2>Error Loading Bookings</h2>
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
          <h1 className="dashboard-hero-title">My <span className="dashboard-animated">Bookings</span></h1>
          <p className="dashboard-hero-subtitle">Manage your current and past hostel bookings</p>
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
              <div id="my-bookings" className="dashboard-panel active">
              
              {/* Booking Statistics */}
              <div className="stats-grid-modern" style={{marginBottom: '30px'}}>
                {(() => {
                  const stats = dashboardService.calculateBookingStats(bookingHistory);
                  return (
                    <>
                      <div className="stat-card-modern blue">
                        <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
                        <div className="stat-info">
                          <h3>{stats.activeBookings}</h3>
                          <p>Active Bookings</p>
                        </div>
                      </div>
                      <div className="stat-card-modern green">
                        <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                        <div className="stat-info">
                          <h3>{stats.totalBookings}</h3>
                          <p>Total Bookings</p>
                        </div>
                      </div>
                      <div className="stat-card-modern orange">
                        <div className="stat-icon"><i className="fas fa-money-bill-wave"></i></div>
                        <div className="stat-info">
                          <h3>{dashboardService.formatCurrency(stats.totalSpent)}</h3>
                          <p>Total Spent</p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="dashboard-header">
                <div>
                  <h2>Booking History</h2>
                  <p className="muted">Manage your current and past hostel bookings</p>
                </div>
                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                  <div className="search-wrapper-sm">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Search bookings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{width: '200px'}} />
                  </div>
                  <div className="filter-buttons">
                    <button className={`filter-btn-small ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}><i className="fas fa-list"></i> All</button>
                    <button className={`filter-btn-small ${filterStatus === 'confirmed' ? 'active' : ''}`} onClick={() => setFilterStatus('confirmed')}><i className="fas fa-check"></i> Active</button>
                    <button className={`filter-btn-small ${filterStatus === 'cancelled' ? 'active' : ''}`} onClick={() => setFilterStatus('cancelled')}><i className="fas fa-times"></i> Cancelled</button>
                  </div>
                  <button className="btn primary small" onClick={() => navigate('/hostels')}><i className="fas fa-plus"></i> New Booking</button>
                </div>
              </div>
              <div className="bookings-grid-modern" id="bookingHistoryList">
                {bookingHistory.length === 0 ? (
                  <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px'}}>
                    <i className="fas fa-calendar-times" style={{fontSize: '64px', color: '#cbd5e1', marginBottom: '20px'}}></i>
                    <h3 style={{color: '#64748b', marginBottom: '10px'}}>No Bookings Yet</h3>
                    <p className="muted">Start exploring hostels and make your first booking!</p>
                  </div>
                ) : (
                  bookingHistory
                    .filter(b => filterStatus === 'all' || (b.status || 'confirmed').toLowerCase() === filterStatus)
                    .filter(b => {
                      const hostelName = dashboardService.getHostelName(b);
                      const roomName = dashboardService.getRoomName(b);
                      return hostelName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             roomName.toLowerCase().includes(searchQuery.toLowerCase());
                    })
                    .map((booking, index) => {
                    const bookingDate = new Date(booking.createdAt || booking.bookingDate);
                    const formattedDate = bookingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    const endDate = new Date(booking.endDate);
                    const now = new Date();
                    const bookingStatus = (booking.status || 'active').toLowerCase();
                    let statusText = 'Active';
                    let statusClass = 'confirmed';
                    let isCurrent = false;
                    if (bookingStatus === 'cancelled') {
                      statusText = 'Cancelled';
                      statusClass = 'cancelled';
                    } else if (endDate <= now) {
                      statusText = 'Completed';
                      statusClass = 'completed';
                    } else {
                      isCurrent = true;
                    }
                    const semester = isCurrent ? 'Aug 2024 - Dec 2024' : 'Jan 2024 - May 2024';
                    const hostelName = dashboardService.getHostelName(booking);
                    const roomName = dashboardService.getRoomName(booking);
                    const roomPrice = dashboardService.getRoomPrice(booking);

                    return (
                      <div className="booking-card-modern" key={index}>
                        <div className="booking-card-header">
                          <div className="booking-icon"><i className="fas fa-building"></i></div>
                          <span className={`status-badge-modern ${statusClass}`}>{statusText}</span>
                        </div>
                        <div className="booking-card-body">
                          <h4>{hostelName}</h4>
                          <div className="booking-detail-row">
                            <i className="fas fa-door-open"></i>
                            <span>{roomName}</span>
                          </div>
                          <div className="booking-detail-row">
                            <i className="fas fa-calendar"></i>
                            <span>{semester}</span>
                          </div>
                          <div className="booking-detail-row">
                            <i className="fas fa-clock"></i>
                            <span>Booked on {formattedDate}</span>
                          </div>
                          <div className="booking-price-tag">UGX {parseInt(roomPrice).toLocaleString()}</div>
                        </div>
                        <div className="booking-card-actions">
                          <button 
                            className="btn-action-modern download" 
                            onClick={() => handleDownloadReceipt(booking, index)}
                            disabled={downloadingReceipt === index}
                          >
                            {downloadingReceipt === index ? (
                              <><i className="fas fa-spinner fa-spin"></i> Generating...</>
                            ) : (
                              <><i className="fas fa-download"></i> Receipt</>
                            )}
                          </button>
                          {isCurrent ? (
                            <button className="btn-action-modern cancel" onClick={() => openCancelModal(booking)}>
                              <i className="fas fa-times"></i> Cancel
                            </button>
                          ) : (
                            <button className="btn-action-modern review" onClick={() => openReviewModal(booking)}>
                              <i className="fas fa-star"></i> Review
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
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
      <CancelBookingModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelBooking}
        bookingDetails={bookingToCancel ? {
          hostel: dashboardService.getHostelName(bookingToCancel),
          room: dashboardService.getRoomName(bookingToCancel)
        } : null}
      />
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={handleReviewSubmitted}
        booking={bookingToReview}
      />
    </>
  );
};

export default MyBookingsPage;