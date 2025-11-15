import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import '../../styles/modern-dashboard.css';

const CustodianAuditLogPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [filterUser, setFilterUser] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const custodianProfile = {
    fullName: userProfile?.name || 'Custodian',
    course: userProfile?.role || 'Custodian',
    profilePicture: userProfile?.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Enhanced audit log data
  const allAuditLogs = [
    { id: 1, user: 'John K. (Admin)', action: 'Payment Approved', details: 'Approved payment for Jane Doe (Room A-102)', dateTime: '29 Jul 2024, 10:15 AM', statusClass: 'approved', ipAddress: '192.168.1.100', sessionId: 'sess_123' },
    { id: 2, user: 'System', action: 'Room Assigned', details: 'Assigned Room A-102 to Jane Doe', dateTime: '29 Jul 2024, 10:15 AM', statusClass: 'booked', ipAddress: 'System', sessionId: 'auto' },
    { id: 3, user: 'Jane Doe (Student)', action: 'Maintenance Request', details: 'New ticket for Room A-102 (Broken Window)', dateTime: '28 Jul 2024, 03:45 PM', statusClass: 'submitted', ipAddress: '192.168.1.105', sessionId: 'sess_456' },
    { id: 4, user: 'John K. (Admin)', action: 'Payment Rejected', details: 'Rejected payment for Mike Ross (Insufficient Amount)', dateTime: '28 Jul 2024, 09:00 AM', statusClass: 'rejected', ipAddress: '192.168.1.100', sessionId: 'sess_789' },
    { id: 5, user: 'John K. (Admin)', action: 'Bulk Approval', details: 'Approved 3 payments in bulk operation', dateTime: '29 Jul 2024, 11:30 AM', statusClass: 'approved', ipAddress: '192.168.1.100', sessionId: 'sess_123' },
  ];

  const filteredLogs = allAuditLogs.filter(log => {
    return (!filterUser || log.user.toLowerCase().includes(filterUser.toLowerCase())) &&
           (!filterAction || log.action.toLowerCase().includes(filterAction.toLowerCase())) &&
           (!filterDate || log.dateTime.includes(filterDate));
  });

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <section className="custodian-hero">
        <div className="floating-icons">
          <i className="fa-solid fa-clipboard-list floating-icon-1"></i>
          <i className="fa-solid fa-history floating-icon-2"></i>
          <i className="fa-solid fa-shield-alt floating-icon-3"></i>
          <i className="fa-solid fa-eye floating-icon-4"></i>
          <i className="fa-solid fa-file-alt floating-icon-5"></i>
          <i className="fa-solid fa-lock floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>System <span className="dashboard-animated">Audit Log</span></h1>
          <p>Complete log of all system actions and user activities</p>
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
            <div className="dashboard-header">
              <h2>System Audit Log</h2>
              <p className="muted">A complete log of all actions taken in the system.</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Filter by user..."
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', minWidth: '150px' }}
              />
              <input 
                type="text" 
                placeholder="Filter by action..."
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', minWidth: '150px' }}
              />
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
              />
              <button 
                onClick={() => { setFilterUser(''); setFilterAction(''); setFilterDate(''); }}
                style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
              >
                Clear Filters
              </button>
            </div>

            <div className="dashboard-section">
              <div className="custodian-table-wrapper">
                <table className="custodian-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Action</th>
                      <th>Details</th>
                      <th>Date & Time</th>
                      <th>IP Address</th>
                      <th>Session ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map(log => (
                      <tr key={log.id}>
                        <td>{log.user}</td>
                        <td><span className={`status-badge ${log.statusClass}`}>{log.action}</span></td>
                        <td>{log.details}</td>
                        <td>{log.dateTime}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{log.ipAddress}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{log.sessionId}</td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No audit logs match your filters</td></tr>
                    )}
                  </tbody>
                </table>
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

export default CustodianAuditLogPage;