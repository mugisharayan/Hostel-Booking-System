import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userProfile } = useContext(AuthContext);

  console.log('ProtectedRoute check:', { 
    isAuthenticated, 
    userRole: userProfile?.role, 
    allowedRoles,
    userProfile 
  });

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  const userRole = userProfile?.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log('Role not allowed:', {
      userRole,
      allowedRoles,
      includes: allowedRoles.includes(userRole)
    });
    const redirectPath = userRole === 'Custodian' ? '/custodian-dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  console.log('Access granted to protected route');
  return <Outlet />;
};

export default ProtectedRoute;