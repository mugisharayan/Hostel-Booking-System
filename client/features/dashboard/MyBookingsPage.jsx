import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import { jsPDF } from 'jspdf'; // Assuming jspdf is installed
import { AuthContext } from '../auth/AuthContext';
import DashboardSidebar from './DashboardSidebar';

const MyBookingsPage = ({ onOpenReviewModal }) => {
  const navigate = useNavigate();
  const { userProfile, bookingHistory, login, logout, setBookingHistory } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (!userProfile) {
      const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
      const storedBookings = JSON.parse(localStorage.getItem('bookingHistory'));
      if (storedProfile && storedBookings) {
        login(storedProfile, storedBookings);
      } else {
        navigate('/');
      }
    }
  }, [userProfile, navigate, login]);

  const handleCancelBooking = (index) => {
    const updatedBookings = [...bookingHistory];
    updatedBookings[index].status = 'Cancelled';
    localStorage.setItem('bookingHistory', JSON.stringify(updatedBookings));
    setBookingHistory(updatedBookings);
    // showToast('Booking has been cancelled.');
  };

  const generateReceipt = (booking, user) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Booking Receipt', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('BookMyHostel', 105, 28, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Booking Details', 20, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Hostel: ${booking.hostel}`, 20, 60);
    doc.text(`Room Type: ${booking.room}`, 20, 68);
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleDateString('en-GB')}`, 20, 76);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To', 20, 96);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${user.fullName}`, 20, 106);
    doc.text(`Email: ${user.email}`, 20, 114);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount Paid:', 20, 140);
    doc.text(`UGX ${parseInt(booking.price).toLocaleString()}`, 190, 140, { align: 'right' });
    doc.save(`Receipt-${booking.hostel.replace(/\s/g, '-')}.pdf`);
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
            <h2>Loading Bookings...</h2>
            <p className="muted">Please wait while we fetch your data.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
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
              <h2>My Bookings</h2>
              <p className="muted">A history of your current and past hostel bookings.</p>
              <div className="booking-history-list" id="bookingHistoryList">
                {bookingHistory.length === 0 ? (
                  <p className="muted">You have no bookings yet.</p>
                ) : (
                  bookingHistory.map((booking, index) => {
                    const bookingDate = new Date(booking.bookingDate);
                    const formattedDate = bookingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    const isCurrent = index === 0 && booking.status !== 'Cancelled';
                    const statusClass = booking.status ? booking.status.toLowerCase() : 'completed';
                    const statusText = booking.status || 'Completed';
                    const semester = isCurrent ? 'Aug 2024 - Dec 2024' : 'Jan 2024 - May 2024';

                    return (
                      <div className="booking-history-item" key={index}>
                        <div className="item-details">
                          <h4>{booking.hostel} <span className={`booking-status ${statusClass}`}>{statusText}</span></h4>
                          <p><strong>Room:</strong> {booking.room} | <strong>Semester:</strong> {semester}</p>
                          <p className="muted" style={{ fontSize: '13px' }}>Booked on: {formattedDate}</p>
                        </div>
                        <div className="item-actions">
                          <div className="item-price">UGX {parseInt(booking.price).toLocaleString()}</div>
                          <button className="btn outline small download-receipt-btn" onClick={() => generateReceipt(booking, userProfile)}>Download Receipt</button>
                          {isCurrent ? (
                            <button className="btn outline small" style={{ color: '#c62828', borderColor: '#c62828' }} onClick={() => handleCancelBooking(index)}>Cancel Booking</button>
                          ) : (
                            <button className="btn primary small write-review-btn" onClick={() => onOpenReviewModal(booking.hostel)}>Write a Review</button>
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
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </main>
  );
};

export default MyBookingsPage;