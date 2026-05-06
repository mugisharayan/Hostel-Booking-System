import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userProfile, loading } = useContext(AuthContext);
  const userRole = userProfile?.role;
  const normalizedRole = typeof userRole === 'string' ? userRole.toLowerCase() : '';
  const normalizedAllowedRoles = allowedRoles?.map((role) =>
    typeof role === 'string' ? role.toLowerCase() : role
  );

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(normalizedRole)) {
    const redirectPath = normalizedRole === 'custodian' ? '/custodian-dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
