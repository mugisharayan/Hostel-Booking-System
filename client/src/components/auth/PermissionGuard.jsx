import React from 'react';
import { hasPermission } from '../../utils/permissions';

const PermissionGuard = ({ userRole, permission, children, fallback = null }) => {
  if (!hasPermission(userRole, permission)) {
    return fallback;
  }
  
  return children;
};

export default PermissionGuard;