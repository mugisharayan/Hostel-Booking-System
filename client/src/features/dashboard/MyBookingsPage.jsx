export { default } from './MyBookingsPage.jsx';
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
