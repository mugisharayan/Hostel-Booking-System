import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentDashboard } from '../api';
import { useAuth } from '../auth/AuthContext';
import './StudentDashboard.css';

// --- Helper for formatting ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};


// --- Main Dashboard Component ---
function StudentDashboard() {
    const { logout } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await getStudentDashboard();
                setDashboardData(data);
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    logout(); // Token is invalid or expired, log out user
                    navigate('/login');
                }
                setError('Failed to load dashboard data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, logout]);

    const handleMakePayment = () => {
        if (dashboardData?.currentBooking?._id) {
            navigate(`/payment/${dashboardData.currentBooking._id}`);
        } else {
            alert("No active booking found to make a payment for.");
        }
    };

    if (loading) {
        return <div className="dashboard-container"><div className="loader">Loading Dashboard...</div></div>;
    }

    if (error) {
        return <div className="dashboard-container"><div className="error-message">{error}</div></div>;
    }

    if (!dashboardData) {
        return <div className="dashboard-container"><div className="error-message">No data available.</div></div>;
    }
    
    const { student, currentBooking, paymentHistory, notifications, maintenanceRequests, bookingHistory } = dashboardData;
    const outstandingBalance = currentBooking ? (currentBooking.totalAmount || 0) - (currentBooking.amountPaid || 0) : 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {student.firstName}!</h1>
                <p>Your central hub for managing your hostel stay.</p>
            </div>

            <div className="dashboard-grid">
                {/* Booking Summary Card */}
                <div className="dashboard-card booking-summary">
                    <h3>Current Booking</h3>
                    {currentBooking ? (
                        <>
                            <p><strong>Hostel:</strong> {currentBooking.hostel?.name || 'N/A'}</p>
                            <p><strong>Room:</strong> {currentBooking.room?.roomNumber || 'N/A'} ({currentBooking.room?.roomType || 'N/A'})</p>
                            <p><strong>Check-in:</strong> {formatDate(currentBooking.checkInDate)}</p>
                            <p><strong>Check-out:</strong> {formatDate(currentBooking.checkOutDate)}</p>
                            <span className={`status-badge status-${currentBooking.status?.toLowerCase()}`}>{currentBooking.status}</span>
                        </>
                    ) : <p>You have no active bookings.</p>}
                </div>

                {/* Payment Status Widget */}
                <div className="dashboard-card payment-status">
                    <h3>Payment Status</h3>
                    <p className="outstanding-balance">
                        <strong>Outstanding:</strong> {formatCurrency(outstandingBalance)}
                    </p>
                    <h4>Recent Payments:</h4>
                    <ul>
                        {paymentHistory?.length > 0 ? paymentHistory.map(p => (
                            <li key={p._id}>
                                <span>{formatDate(p.createdAt)}</span>
                                <span>{formatCurrency(p.amount)}</span>
                            </li>
                        )) : <li>No recent payments.</li>}
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card quick-actions">
                    <h3>Quick Actions</h3>
                    <button onClick={handleMakePayment}>Make Payment</button>
                    <button onClick={() => alert('Extend Booking: Feature coming soon!')}>Extend Booking</button>
                    <button onClick={() => document.getElementById('maintenance')?.scrollIntoView({ behavior: 'smooth' })}>
                        Maintenance Request
                    </button>
                </div>

                {/* Notifications Panel */}
                <div className="dashboard-card notifications">
                    <h3>Notifications</h3>
                    {notifications?.length > 0 ? notifications.map(n => (
                        <div key={n.id} className={`notification-item type-${n.type}`}>
                            <p>{n.message}</p>
                        </div>
                    )) : <p>No new notifications.</p>}
                </div>

                {/* Profile Summary */}
                <div className="dashboard-card profile-summary">
                    <img src={student.profilePicture || 'https://via.placeholder.com/150'} alt="Profile" className="profile-pic" />
                    <h3>{student.firstName} {student.lastName}</h3>
                    <p>{student.studentId || 'No ID'}</p>
                    <p>{student.email}</p>
                    <p>{student.phone}</p>
                </div>
                
                {/* Maintenance Section */}
                <div id="maintenance" className="dashboard-card maintenance-section">
                    <h3>Maintenance Requests</h3>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Maintenance request submitted!'); e.target.reset(); }}>
                        <textarea required placeholder="Describe the issue... (e.g., 'The shower head is leaking.')"></textarea>
                        <button type="submit">Submit Request</button>
                    </form>
                    <h4>Request History:</h4>
                    <ul className="maintenance-list">
                        {maintenanceRequests?.length > 0 ? maintenanceRequests.map(req => (
                            <li key={req._id}>
                                <span>{req.request}</span>
                                <span className={`status-badge status-${req.status?.toLowerCase().replace(' ', '-')}`}>{req.status}</span>
                            </li>
                        )) : <li>No requests found.</li>}
                    </ul>
                </div>

                {/* Booking History Table */}
                <div className="dashboard-card booking-history">
                    <h3>Booking History</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Hostel</th>
                                <th>Room</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingHistory?.length > 0 ? bookingHistory.map(b => (
                                <tr key={b._id}>
                                    <td>{b.hostelName || 'N/A'}</td>
                                    <td>{b.roomNumber || 'N/A'}</td>
                                    <td>{formatDate(b.checkInDate)}</td>
                                    <td>{formatDate(b.checkOutDate)}</td>
                                    <td>{b.status}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5">No past bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;