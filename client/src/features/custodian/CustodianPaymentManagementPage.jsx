import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../service/api.service';
import { AuthContext } from '../auth/AuthContext';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import useRealTimeUpdates from '../../hooks/useRealTimeUpdates';
import AdvancedSearch from '../../components/search/AdvancedSearch';
import { exportToCSV, formatPaymentData } from '../../utils/exportUtils';
import PermissionGuard from '../../components/auth/PermissionGuard';
import TwoFactorAuth from '../../components/auth/TwoFactorAuth';
import { PERMISSIONS, ROLES } from '../../utils/permissions';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/modern-dashboard.css';
import '../../styles/mobile-responsive.css';
import '../../styles/custodian-modern.css';
import '../../styles/payment-modern.css';
import '../../styles/payment-enhanced.css';

const CustodianPaymentManagementPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false);
  const [isViewProofModalOpen, setIsViewProofModalOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});
  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const custodianProfile = {
    fullName: userProfile?.name || 'Custodian',
    course: userProfile?.role || 'Custodian',
    role: ROLES.SENIOR_CUSTODIAN,
    profilePicture: userProfile?.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Real-time data for payments
  const initialPayments = [
    { id: 1, studentName: 'John Doe', studentId: '22/U/12345', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', amount: '850,000', method: 'Mobile Money', date: '2024-07-28 10:30 AM', status: 'Pending', selected: false },
    { id: 2, studentName: 'Aisha Bello', studentId: '22/U/98765', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', amount: '850,000', method: 'Mobile Money', date: '2024-07-27 02:11 PM', status: 'Flagged', selected: false },
  ];
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const [paymentMethodStats, setPaymentMethodStats] = useState({ mobileMoney: 0, creditCard: 0, bankTransfer: 0, total: 0 });

  // Load pending payments from database
  useEffect(() => {
    loadPendingPayments();
  }, []);
  
  const loadPendingPayments = async () => {
    setLoading(true);
    try {
      const response = await apiService.custodian.getPayments();
      const allPayments = response.data.data || [];
      
      // Calculate payment method statistics from all payments
      const methodStats = {
        mobileMoney: allPayments.filter(p => p.paymentMethod === 'Mobile Money').length,
        creditCard: allPayments.filter(p => p.paymentMethod === 'Credit Card').length,
        bankTransfer: allPayments.filter(p => p.paymentMethod === 'Bank Transfer').length,
        total: allPayments.length
      };
      setPaymentMethodStats(methodStats);
      
      // Filter for pending payments only
      const pending = allPayments.filter(payment => payment.status === 'Pending');
      
      // Transform data to match UI expectations
      const transformedPayments = pending.map(payment => ({
        id: payment._id,
        studentName: payment.student?.name || 'Unknown Student',
        studentId: payment.student?.email?.split('@')[0] || 'N/A',
        avatar: payment.student?.profilePicture || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        amount: payment.amount?.toLocaleString() || '0',
        method: payment.paymentMethod || 'Unknown',
        date: new Date(payment.createdAt).toLocaleString(),
        status: payment.status,
        selected: false,
        transactionId: payment.transactionId
      }));
      
      setPendingPayments(transformedPayments);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load pending payments:', error);
      setPendingPayments([]);
    } finally {
      setLoading(false);
    }
  };
  const [selectedPayments, setSelectedPayments] = useState([]);

  const [paymentHistory, setPaymentHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('paymentHistory') || '[]');
  });

  const handleApprovePayment = async (paymentId) => {
    setLoading(true);
    try {
      const response = await apiService.custodian.approvePayment(paymentId);
      if (response.data.success) {
        // Remove from pending payments
        setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
        
        // Add to payment history
        const approvedPayment = pendingPayments.find(p => p.id === paymentId);
        if (approvedPayment) {
          const historyEntry = { 
            ...approvedPayment, 
            status: 'Approved', 
            dateVerified: new Date().toLocaleDateString('en-GB'), 
            refundStatus: 'N/A' 
          };
          setPaymentHistory(prev => {
            const updated = [historyEntry, ...prev];
            localStorage.setItem('paymentHistory', JSON.stringify(updated));
            return updated;
          });
        }
        
        alert('Payment approved successfully!');
        loadPendingPayments(); // Reload payments
      }
    } catch (error) {
      console.error('Failed to approve payment:', error);
      alert('Failed to approve payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    setLoading(true);
    try {
      const response = await apiService.custodian.rejectPayment(paymentId);
      if (response.data.success) {
        // Remove from pending payments
        setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
        
        // Add to payment history
        const rejectedPayment = pendingPayments.find(p => p.id === paymentId);
        if (rejectedPayment) {
          const historyEntry = { 
            ...rejectedPayment, 
            status: 'Rejected', 
            dateVerified: new Date().toLocaleDateString('en-GB'), 
            refundStatus: 'Pending' 
          };
          setPaymentHistory(prev => {
            const updated = [historyEntry, ...prev];
            localStorage.setItem('paymentHistory', JSON.stringify(updated));
            return updated;
          });
        }
        
        alert('Payment rejected successfully!');
        loadPendingPayments(); // Reload payments
      }
    } catch (error) {
      console.error('Failed to reject payment:', error);
      alert('Failed to reject payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentSelection = (id) => {
    setSelectedPayments(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAllPayments = () => {
    const allIds = pendingPayments.map(p => p.id);
    setSelectedPayments(selectedPayments.length === allIds.length ? [] : allIds);
  };

  const handleBulkApprove = () => {
    setPendingAction('bulk_approve');
    setIs2FAOpen(true);
  };

  const executeBulkApprove = () => {
    const approvedPayments = pendingPayments.filter(p => selectedPayments.includes(p.id));
    setPendingPayments(prev => prev.filter(p => !selectedPayments.includes(p.id)));
    const historyEntries = approvedPayments.map(p => ({ ...p, status: 'Approved', dateVerified: new Date().toLocaleDateString('en-GB'), refundStatus: 'N/A' }));
    setPaymentHistory(prev => {
      const updated = [...historyEntries, ...prev];
      localStorage.setItem('paymentHistory', JSON.stringify(updated));
      return updated;
    });
    
    // Add all approved students to pending assignments
    const pendingStudents = approvedPayments.map(payment => ({
      id: Date.now() + Math.random(),
      name: payment.studentName,
      studentId: payment.studentId,
      email: `${payment.studentId.toLowerCase().replace('/', '')}@university.edu`,
      paidOn: new Date().toLocaleDateString('en-GB'),
      avatar: payment.avatar,
      preferences: 'Single room, Any floor',
      priority: 'high',
      paymentAmount: payment.amount
    }));
    
    // Store in localStorage to pass to room assignment page
    const existingPending = JSON.parse(localStorage.getItem('pendingAssignments') || '[]');
    localStorage.setItem('pendingAssignments', JSON.stringify([...existingPending, ...pendingStudents]));
    
    setSelectedPayments([]);
    // Redirect to room assignment page after bulk approval
    navigate('/custodian-room-assignment');
  };

  const handleBulkReject = () => {
    const rejectedPayments = pendingPayments.filter(p => selectedPayments.includes(p.id));
    setPendingPayments(prev => prev.filter(p => !selectedPayments.includes(p.id)));
    const historyEntries = rejectedPayments.map(p => ({ ...p, status: 'Rejected', dateVerified: new Date().toLocaleDateString('en-GB'), refundStatus: 'Pending' }));
    setPaymentHistory(prev => {
      const updated = [...historyEntries, ...prev];
      localStorage.setItem('paymentHistory', JSON.stringify(updated));
      return updated;
    });
    setSelectedPayments([]);
  };

  const handleExportData = () => {
    const formattedData = formatPaymentData([...pendingPayments, ...paymentHistory]);
    exportToCSV(formattedData, `payment-data-${new Date().toISOString().split('T')[0]}`);
  };

  const handle2FAVerify = (code) => {
    if (code === '123456') { // Simulate verification
      if (pendingAction === 'bulk_approve') {
        executeBulkApprove();
      }
      setIs2FAOpen(false);
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <section className="custodian-hero">
        <div className="floating-icons">
          <i className="fa-solid fa-credit-card floating-icon-1"></i>
          <i className="fa-solid fa-mobile-screen floating-icon-2"></i>
          <i className="fa-solid fa-building-columns floating-icon-3"></i>
          <i className="fa-solid fa-shield-check floating-icon-4"></i>
          <i className="fa-solid fa-chart-line floating-icon-5"></i>
          <i className="fa-solid fa-receipt floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>Payment <span className="dashboard-animated">Management</span></h1>
          <p>Verify, track, and manage all student payments efficiently</p>
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

            {/* Main Content */}
            <div className="dashboard-content">
              {loading ? (
                <LoadingSpinner size="large" text="Loading payments..." />
              ) : (
              <div className="modern-dashboard-container">
                {/* Payment Overview Dashboard */}
                <div className="payment-overview-grid">
<div className="overview-card methods">
                    <div className="card-header">
                      <div className="card-icon"><i className="fa-solid fa-credit-card"></i></div>
                      <span className="card-title">Payment Methods</span>
                    </div>
                    <div className="methods-breakdown">
                      <div className="method-item">
                        <div className="method-icon mobile"><i className="fa-solid fa-mobile-alt"></i></div>
                        <div className="method-info">
                          <span className="method-name">Mobile Money</span>
                          <div className="method-stats">
                            <span className="percentage">{paymentMethodStats.total > 0 ? Math.round((paymentMethodStats.mobileMoney / paymentMethodStats.total) * 100) : 0}%</span>
                            <div className="progress-bar">
                              <div className="progress" style={{width: `${paymentMethodStats.total > 0 ? (paymentMethodStats.mobileMoney / paymentMethodStats.total) * 100 : 0}%`}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="method-item">
                        <div className="method-icon card"><i className="fa-solid fa-credit-card"></i></div>
                        <div className="method-info">
                          <span className="method-name">Credit Card</span>
                          <div className="method-stats">
                            <span className="percentage">{paymentMethodStats.total > 0 ? Math.round((paymentMethodStats.creditCard / paymentMethodStats.total) * 100) : 0}%</span>
                            <div className="progress-bar">
                              <div className="progress" style={{width: `${paymentMethodStats.total > 0 ? (paymentMethodStats.creditCard / paymentMethodStats.total) * 100 : 0}%`}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="method-item">
                        <div className="method-icon bank"><i className="fa-solid fa-university"></i></div>
                        <div className="method-info">
                          <span className="method-name">Bank Transfer</span>
                          <div className="method-stats">
                            <span className="percentage">{paymentMethodStats.total > 0 ? Math.round((paymentMethodStats.bankTransfer / paymentMethodStats.total) * 100) : 0}%</span>
                            <div className="progress-bar">
                              <div className="progress" style={{width: `${paymentMethodStats.total > 0 ? (paymentMethodStats.bankTransfer / paymentMethodStats.total) * 100 : 0}%`}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>

                {/* Enhanced Payment Management Header */}
                <div className="payment-management-header-modern">
                  <div className="header-left">
                    <div className="section-title">
                      <h3><i className="fas fa-shield-check"></i> Payment Verification Center</h3>
                      <div className="real-time-indicator">
                        <div className="status-dot pulsing"></div>
                        <span>Live updates • Last sync: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="header-right">
                    <div className="bulk-actions">
                      <PermissionGuard userRole={custodianProfile.role} permission={PERMISSIONS.BULK_PAYMENT_OPERATIONS}>
                        {selectedPayments.length > 0 && (
                          <div className="bulk-actions-container">
                            <div className="selection-info">
                              <span className="selected-count">{selectedPayments.length} selected</span>
                            </div>
                            <div className="bulk-buttons">
                              <button className="bulk-btn approve" onClick={handleBulkApprove}>
                                <i className="fas fa-check-double"></i>
                                Approve All
                              </button>
                              <button className="bulk-btn reject" onClick={handleBulkReject}>
                                <i className="fas fa-times-circle"></i>
                                Reject All
                              </button>
                            </div>
                          </div>
                        )}
                      </PermissionGuard>
                    </div>
                  </div>
                </div>

              {/* Advanced Filters */}
              <div className={`advanced-filters-section ${isFilterSectionVisible ? 'expanded' : ''}`}>
                <div className="filters-container">
                  <div className="filter-group">
                    <label>Status</label>
                    <select className="filter-select">
                      <option>All Statuses</option>
                      <option>Pending Review</option>
                      <option>Flagged</option>
                      <option>Under Investigation</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Payment Method</label>
                    <select className="filter-select">
                      <option>All Methods</option>
                      <option>Mobile Money</option>
                      <option>Credit Card</option>
                      <option>Bank Transfer</option>
                      <option>Cash</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Amount Range</label>
                    <div className="amount-range">
                      <input type="number" placeholder="Min" className="amount-input" />
                      <span>to</span>
                      <input type="number" placeholder="Max" className="amount-input" />
                    </div>
                  </div>
                  <div className="filter-group">
                    <label>Date Range</label>
                    <div className="date-range">
                      <input type="date" className="date-input" />
                      <span>to</span>
                      <input type="date" className="date-input" />
                    </div>
                  </div>
                  <div className="filter-actions">
                    <button className="filter-btn clear">Clear All</button>
                    <button className="filter-btn apply">Apply Filters</button>
                  </div>
                </div>
              </div>

              {/* Pending Verifications Section */}
              <div className="payments-verification-section">
                <div className="payments-grid-enhanced">
                  {pendingPayments.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-check-circle"></i>
                      <h4>All Caught Up!</h4>
                      <p>No pending payments to review at the moment.</p>
                    </div>
                  ) : (
                    pendingPayments.map(payment => (
                      <div className="payment-card-modern" key={payment.id}>
                        <div className="payment-card-header">
                          <div className="student-section">
                            <input 
                              type="checkbox" 
                              checked={selectedPayments.includes(payment.id)}
                              onChange={() => togglePaymentSelection(payment.id)}
                              className="payment-checkbox"
                            />
                            <div className="student-avatar">
                              <img src={payment.avatar} alt={payment.studentName} />
                            </div>
                            <div className="student-details">
                              <h5>{payment.studentName}</h5>
                              <span className="student-id">{payment.studentId}</span>
                            </div>
                          </div>
                          <div className="payment-status">
                            <span className={`status-badge-modern ${payment.status.toLowerCase()}`}>
                              {payment.status === 'Flagged' && <i className="fas fa-flag"></i>}
                              {payment.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="payment-details-modern">
                          <div className="detail-row">
                            <span className="label">Amount</span>
                            <span className="value amount">UGX {payment.amount}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Method</span>
                            <span className={`payment-method ${payment.method.toLowerCase().replace(' ', '-')}`}>
                              <i className={`fas ${payment.method === 'Mobile Money' ? 'fa-mobile-alt' : payment.method === 'Credit Card' ? 'fa-credit-card' : 'fa-university'}`}></i>
                              {payment.method}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Submitted</span>
                            <span className="value">{payment.date}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Proof</span>
                            <button className="proof-btn" onClick={() => setIsViewProofModalOpen(true)}>
                              <i className="fas fa-eye"></i> View Receipt
                            </button>
                          </div>
                        </div>
                        
                        <div className="payment-actions-modern">
                          <button className="action-btn reject" onClick={() => handleRejectPayment(payment.id)}>
                            <i className="fas fa-times"></i> Reject
                          </button>
                          <button className="action-btn approve" onClick={() => handleApprovePayment(payment.id)}>
                            <i className="fas fa-check"></i> Approve
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Payment History Section */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h3>Payment History</h3>
                </div>
                <div className="custodian-table-wrapper">
                  <table className="custodian-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Payment Method</th>
                        <th>Amount</th>
                        <th>Date Verified</th>
                        <th>Status</th>
                        <th>Refund Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map(record => (
                        <tr key={record.id}>
                          <td>{record.studentName}</td>
                          <td>{record.studentId}</td>
                          <td><span className={`payment-tag ${record.method.toLowerCase().replace(' ', '-')}`}>{record.method}</span></td>
                          <td>UGX {record.amount}</td>
                          <td>{record.dateVerified}</td>
                          <td><span className={`status-badge ${record.status.toLowerCase()}`}>{record.status}</span></td>
                          <td><span className={`status-badge ${record.refundStatus.toLowerCase().replace('n/a', 'neutral')}`}>{record.refundStatus}</span></td>
                          <td><button className="btn-icon download" title="Download Receipt" disabled={record.status !== 'Approved'}><i className="fas fa-download"></i></button></td>
                        </tr>
                      ))}
                      {paymentHistory.length === 0 && (
                        <tr><td colSpan="8" style={{ textAlign: 'center' }}>No payment history available.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      {/* View Proof Modal */}
      {isViewProofModalOpen && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsViewProofModalOpen(false)}>
          <div className="modal-content proof-modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsViewProofModalOpen(false)}>&times;</button>
            <h3>Payment Proof</h3>
            <div className="proof-image-container">
              <img src="https://i.imgur.com/J2yAgdC.png" alt="Sample payment receipt" />
            </div>
          </div>
        </div>
      )}
      
      {isAdvancedSearchOpen && (
        <AdvancedSearch 
          isOpen={isAdvancedSearchOpen}
          onClose={() => setIsAdvancedSearchOpen(false)}
          onSearch={(filters) => setSearchFilters(filters)}
        />
      )}
      
      <TwoFactorAuth 
        isOpen={is2FAOpen}
        onClose={() => { setIs2FAOpen(false); setPendingAction(null); }}
        onVerify={handle2FAVerify}
      />
    </>
  );
};

export default CustodianPaymentManagementPage;