import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { RoomDataProvider } from './src/contexts/RoomDataContext';
import { CustodianProvider } from './src/contexts/CustodianContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { MessageProvider } from './src/contexts/MessageContext';

// Import layout components
import Header from './src/components/layout/Header';
import Footer from './src/components/layout/Footer';
import BackToTop from './src/components/common/BackToTop';

// Import modals and overlays
import AuthModal from './src/features/auth/AuthModal';
import DashboardChoiceModal from './src/components/modals/DashboardChoiceModal';
import ReviewModal from './src/components/modals/ReviewModal';
import FavoritesOverlay from './src/components/overlays/FavoritesOverlay';
import ToastContainer from './src/components/overlays/ToastContainer';

// Import auth
import ProtectedRoute from './src/features/auth/ProtectedRoute';

// Import feature pages
import HomePage from './src/features/home/HomePage';
import AboutPage from './src/features/about/AboutPage';
import HostelsPage from './src/features/hostels/HostelsPage';
import HostelDetailPage from './src/features/hostels/HostelDetailPage';
import BookingPage from './src/features/booking/BookingPage';
import PaymentPage from './src/features/booking/PaymentPage';
import DashboardPage from './src/features/dashboard/DashboardPage';
import MyBookingsPage from './src/features/dashboard/MyBookingsPage';
import MaintenancePage from './src/features/dashboard/MaintenancePage';
import ProfilePage from './src/features/dashboard/ProfilePage';
import CustodianDashboardPage from './src/features/custodian/CustodianDashboardPage';
import CustodianPaymentManagementPage from './src/features/custodian/CustodianPaymentManagementPage';
import CustodianRoomAssignmentPage from './src/features/custodian/CustodianRoomAssignmentPage';
import CustodianRoomManagementPage from './src/features/custodian/CustodianRoomManagementPage';
import CustodianStudentsPage from './src/features/custodian/CustodianStudentsPage';
import CustodianAnalyticsPage from './src/features/custodian/CustodianAnalyticsPage';
import CustodianAuditLogPage from './src/features/custodian/CustodianAuditLogPage';
import CustodianProfilePage from './src/features/custodian/CustodianProfilePage';
import CustodianMaintenancePage from './src/features/custodian/CustodianMaintenancePage';
import HostelRegistrationPage from './src/features/hostels/HostelRegistrationPage';

function App() {
  const location = useLocation();
  // State for modals (these would typically be managed by a context or Redux in a larger app)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectTo, setAuthRedirectTo] = useState(null);
  const [isFavoritesOverlayOpen, setIsFavoritesOverlayOpen] = useState(false);
  const [isDashboardChoiceModalOpen, setIsDashboardChoiceModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewHostelName, setReviewHostelName] = useState('');

  // Student dashboard routes where header and footer should be hidden
  const studentDashboardRoutes = ['/dashboard', '/my-bookings', '/maintenance', '/profile'];
  const shouldHideHeaderFooter = studentDashboardRoutes.includes(location.pathname);

  return (
    <NotificationProvider>
      <MessageProvider>
        <RoomDataProvider>
          <CustodianProvider>
      {!shouldHideHeaderFooter && (
        <Header
          onOpenAuthModal={(redirectTo = null) => {
            setAuthRedirectTo(redirectTo);
            setIsAuthModalOpen(true);
          }}
          onOpenFavorites={() => setIsFavoritesOverlayOpen(true)}
          onOpenDashboardChoice={() => setIsDashboardChoiceModalOpen(true)}
        />
      )}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/hostels" element={<HostelsPage />} />
          <Route path="/hostel/:hostelId" element={<HostelDetailPage onOpenAuthModal={() => {
            setAuthRedirectTo('booking');
            setIsAuthModalOpen(true);
          }} />} />
          <Route path="/register-hostel" element={<HostelRegistrationPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Student', 'student']} />}>
            <Route path="/dashboard" element={<DashboardPage onOpenReviewModal={(name) => { setReviewHostelName(name); setIsReviewModalOpen(true); }} />} />
            <Route path="/my-bookings" element={<MyBookingsPage onOpenReviewModal={(name) => { setReviewHostelName(name); setIsReviewModalOpen(true); }} />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Protected Custodian Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Custodian', 'custodian']} />}>
            <Route path="/custodian-dashboard" element={<CustodianDashboardPage />} />
            <Route path="/custodian-payment-management" element={<CustodianPaymentManagementPage />} />
            <Route path="/custodian-room-assignment" element={<CustodianRoomAssignmentPage />} />
            <Route path="/custodian-room-management" element={<CustodianRoomManagementPage />} />
            <Route path="/custodian-students" element={<CustodianStudentsPage />} />
            <Route path="/custodian-analytics" element={<CustodianAnalyticsPage />} />
            <Route path="/custodian-maintenance" element={<CustodianMaintenancePage />} />
            <Route path="/custodian-audit-log" element={<CustodianAuditLogPage />} />
            <Route path="/custodian-profile" element={<CustodianProfilePage />} />
          </Route>

          {/* Add a 404 Not Found page */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
      {!shouldHideHeaderFooter && <Footer />}

      {/* Modals and Overlays */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthRedirectTo(null);
        }} 
        redirectTo={authRedirectTo}
      />
      <FavoritesOverlay isOpen={isFavoritesOverlayOpen} onClose={() => setIsFavoritesOverlayOpen(false)} />
      <DashboardChoiceModal isOpen={isDashboardChoiceModalOpen} onClose={() => setIsDashboardChoiceModalOpen(false)} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} hostelName={reviewHostelName} />

      <ToastContainer />
      <BackToTop />
          </CustodianProvider>
        </RoomDataProvider>
      </MessageProvider>
    </NotificationProvider>
  );
}

export default App;
