import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCustodian } from '../../contexts/CustodianContext';
import '../../styles/modern-dashboard.css';
import '../../styles/analytics-modern.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';

try {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
} catch (error) {
  console.error('Chart.js registration failed:', error);
}

const CustodianAnalyticsPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState('All Time');
  const { rooms, roomStats, analytics, loadDashboardData, loadRooms } = useCustodian();
  const [roomTypeStats, setRoomTypeStats] = useState({ single: 0, double: 0 });
  const [maintenanceStats, setMaintenanceStats] = useState({ pending: 0, inProgress: 0, resolved: 0, total: 0 });
  const [paymentMethodStats, setPaymentMethodStats] = useState({ mobileMoney: 0, bankTransfer: 0, creditCard: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadDashboardData(),
          loadRooms(),
          loadPaymentStats()
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const loadPaymentStats = async () => {
    try {
      const { useCustodian } = await import('../../contexts/CustodianContext');
      const custodianService = (await import('../../service/custodian.service')).default;
      const payments = await custodianService.getPayments();
      
      if (payments && payments.length > 0) {
        const methodStats = {
          mobileMoney: payments.filter(p => p.paymentMethod === 'Mobile Money').length,
          bankTransfer: payments.filter(p => p.paymentMethod === 'Bank Transfer').length,
          creditCard: payments.filter(p => p.paymentMethod === 'Credit Card').length
        };
        setPaymentMethodStats(methodStats);
      }
    } catch (error) {
      console.error('Failed to load payment stats:', error);
    }
  };

  useEffect(() => {
    if (rooms && rooms.length > 0) {
      // Calculate room type stats from database
      const typeStats = {
        single: rooms.filter(r => r.roomType === 'Single').length,
        double: rooms.filter(r => r.roomType === 'Double').length
      };
      setRoomTypeStats(typeStats);

      // Calculate maintenance stats from database
      const maintStats = {
        pending: rooms.filter(r => r.status === 'Maintenance').length,
        inProgress: 0,
        resolved: 0,
        total: rooms.filter(r => r.status === 'Maintenance').length
      };
      setMaintenanceStats(maintStats);
    }
  }, [rooms]);

  const custodianProfile = {
    fullName: userProfile?.name || 'Custodian',
    course: userProfile?.role || 'Custodian',
    profilePicture: userProfile?.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };



  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false }
    },
    animation: false
  };

  const roomStatusData = {
    labels: ['Available', 'Booked', 'Partially Booked', 'Maintenance'],
    datasets: [{
      data: [
        roomStats?.available || 0,
        roomStats?.occupied || 0,
        rooms?.filter(r => r.status === 'Partially Booked').length || 0,
        roomStats?.maintenance || 0
      ],
      backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#EF4444'],
      borderWidth: 0
    }]
  };

  const roomTypeData = {
    labels: ['Single Rooms', 'Double Rooms'],
    datasets: [{
      data: [roomTypeStats.single || 0, roomTypeStats.double || 0],
      backgroundColor: ['#06B6D4', '#EC4899'],
      borderWidth: 0
    }]
  };

  const paymentMethodData = {
    labels: ['Mobile Money', 'Bank Transfer', 'Credit Card'],
    datasets: [{
      data: [
        paymentMethodStats.mobileMoney || 0,
        paymentMethodStats.bankTransfer || 0,
        paymentMethodStats.creditCard || 0
      ],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
      borderWidth: 0
    }]
  };

  const ChartComponent = ({ type, data, options, id }) => {
    try {
      const chartProps = {
        data,
        options: {
          ...options,
          plugins: {
            ...options.plugins,
            legend: {
              ...options.plugins?.legend,
              display: true
            }
          }
        },
        key: id
      };
      
      if (type === 'doughnut') return <Doughnut {...chartProps} />;
      if (type === 'pie') return <Pie {...chartProps} />;
      if (type === 'bar') return <Bar {...chartProps} />;
      return <div>Chart type not supported</div>;
    } catch (error) {
      console.error('Chart rendering error:', error);
      return <div className="chart-error">Chart failed to load</div>;
    }
  };



  const generatePDFReport = () => {
    // PDF generation functionality would go here
    console.log('PDF report generation requested');
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <section className="custodian-hero">
        <div className="floating-icons">
          <i className="fa-solid fa-chart-line floating-icon-1"></i>
          <i className="fa-solid fa-chart-bar floating-icon-2"></i>
          <i className="fa-solid fa-chart-pie floating-icon-3"></i>
          <i className="fa-solid fa-file-chart-line floating-icon-4"></i>
          <i className="fa-solid fa-analytics floating-icon-5"></i>
          <i className="fa-solid fa-chart-area floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>Analytics & <span className="dashboard-animated">Reports</span></h1>
          <p>Track key metrics and performance indicators</p>
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
              {isLoading ? (
                <LoadingSpinner size="large" text="Loading analytics..." />
              ) : (
              <>
              <div className="header-actions" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: '#2d3748' }}>Room Analytics Dashboard</h2>
                <button className="btn outline small" onClick={generatePDFReport} style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>
                  <i className="fas fa-download"></i> Export Report
                </button>
              </div>
              <div className="modern-dashboard-container">
                {/* Real Room Stats */}
                <div className="stats-grid-modern">
                  <div className="stat-card-modern green">
                    <div className="stat-icon"><i className="fa-solid fa-check-circle"></i></div>
                    <div className="stat-info">
                      <h3>{roomStats?.available || 0}</h3>
                      <p>Available Rooms</p>
                      <span className="stat-trend positive">Ready for booking</span>
                    </div>
                  </div>
                  <div className="stat-card-modern blue">
                    <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
                    <div className="stat-info">
                      <h3>{roomStats?.occupied || 0}</h3>
                      <p>Occupied Rooms</p>
                      <span className="stat-trend positive">{roomStats?.occupancyRate || 0}% occupancy</span>
                    </div>
                  </div>
                  <div className="stat-card-modern orange">
                    <div className="stat-icon"><i className="fa-solid fa-calendar-check"></i></div>
                    <div className="stat-info">
                      <h3>{rooms?.filter(r => r.status === 'Booked').length || 0}</h3>
                      <p>Booked Rooms</p>
                      <span className="stat-trend positive">Pending check-in</span>
                    </div>
                  </div>
                  <div className="stat-card-modern purple">
                    <div className="stat-icon"><i className="fa-solid fa-tools"></i></div>
                    <div className="stat-info">
                      <h3>{roomStats?.maintenance || 0}</h3>
                      <p>Under Maintenance</p>
                      <span className="stat-trend negative">Needs attention</span>
                    </div>
                  </div>
                </div>

                {/* Room Overview Cards */}
                <div className="analytics-overview-grid">
                  <div className="overview-card">
                    <div className="overview-header">
                      <h3><i className="fas fa-building"></i> Room Overview</h3>
                      <p>Total rooms and utilization</p>
                    </div>
                    <div className="overview-stats">
                      <div className="overview-stat">
                        <span className="stat-number">{roomStats?.total || 0}</span>
                        <span className="stat-label">Total Rooms</span>
                      </div>
                      <div className="overview-stat">
                        <span className="stat-number">{roomStats?.occupancyRate || 0}%</span>
                        <span className="stat-label">Occupancy Rate</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overview-card">
                    <div className="overview-header">
                      <h3><i className="fas fa-bed"></i> Room Types</h3>
                      <p>Distribution by room type</p>
                    </div>
                    <div className="overview-stats">
                      <div className="overview-stat">
                        <span className="stat-number">{roomTypeStats.single}</span>
                        <span className="stat-label">Single Rooms</span>
                      </div>
                      <div className="overview-stat">
                        <span className="stat-number">{roomTypeStats.double}</span>
                        <span className="stat-label">Double Rooms</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overview-card">
                    <div className="overview-header">
                      <h3><i className="fas fa-wrench"></i> Maintenance</h3>
                      <p>Current maintenance status</p>
                    </div>
                    <div className="overview-stats">
                      <div className="overview-stat">
                        <span className="stat-number">{maintenanceStats.pending}</span>
                        <span className="stat-label">Pending</span>
                      </div>
                      <div className="overview-stat">
                        <span className="stat-number">{maintenanceStats.inProgress}</span>
                        <span className="stat-label">In Progress</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room Insights */}
                {(roomStats?.total || 0) > 0 && (
                  <div className="insights-section">
                    <div className="section-header">
                      <h3><i className="fas fa-lightbulb"></i> Room Insights</h3>
                      <p>Based on your current room data</p>
                    </div>
                    <div className="insights-grid">
                      {(roomStats?.occupancyRate || 0) > 80 && (
                        <div className="insight-card high-occupancy">
                          <i className="fas fa-chart-line"></i>
                          <div className="insight-content">
                            <h4>High Occupancy</h4>
                            <p>Your occupancy rate is {roomStats?.occupancyRate || 0}%. Consider adding more rooms.</p>
                          </div>
                        </div>
                      )}
                      {maintenanceStats.total > 0 && (
                        <div className="insight-card maintenance-alert">
                          <i className="fas fa-exclamation-triangle"></i>
                          <div className="insight-content">
                            <h4>Maintenance Required</h4>
                            <p>{maintenanceStats.total} room{maintenanceStats.total > 1 ? 's' : ''} need{maintenanceStats.total === 1 ? 's' : ''} maintenance attention.</p>
                          </div>
                        </div>
                      )}
                      {(roomStats?.available || 0) > (roomStats?.occupied || 0) && (
                        <div className="insight-card availability">
                          <i className="fas fa-check-circle"></i>
                          <div className="insight-content">
                            <h4>Good Availability</h4>
                            <p>{roomStats?.available || 0} rooms available for new bookings.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Charts Section */}
                {(roomStats?.total || 0) > 0 ? (
                  <div className="charts-grid-modern">
                    <div className="chart-card">
                      <div className="chart-header">
                        <h4><i className="fas fa-chart-pie"></i> Room Status</h4>
                        <p>Current status distribution</p>
                      </div>
                      <div className="chart-container">
                        <ChartComponent type="doughnut" data={roomStatusData} options={chartOptions} id="room-status-chart" />
                      </div>
                    </div>
                    
                    <div className="chart-card">
                      <div className="chart-header">
                        <h4><i className="fas fa-bed"></i> Room Types</h4>
                        <p>Single vs Double rooms</p>
                      </div>
                      <div className="chart-container">
                        <ChartComponent type="pie" data={roomTypeData} options={chartOptions} id="room-type-chart" />
                      </div>
                    </div>
                    
                    <div className="chart-card">
                      <div className="chart-header">
                        <h4><i className="fas fa-credit-card"></i> Payment Methods</h4>
                        <p>Payment method distribution</p>
                      </div>
                      <div className="chart-container">
                        <ChartComponent type="bar" data={paymentMethodData} options={chartOptions} id="payment-chart" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-analytics-state">
                    <div className="empty-icon">
                      <i className="fas fa-chart-bar"></i>
                    </div>
                    <h4>No Room Data Available</h4>
                    <p>Add rooms in Room Management to see analytics</p>
                  </div>
                )}
              </div>
              </>
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
    </>
  );
};

export default CustodianAnalyticsPage;