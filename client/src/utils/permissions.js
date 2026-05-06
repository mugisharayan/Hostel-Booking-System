export const ROLES = {
  SENIOR_CUSTODIAN: 'senior_custodian',
  JUNIOR_CUSTODIAN: 'junior_custodian',
  MAINTENANCE_STAFF: 'maintenance_staff'
};

export const PERMISSIONS = {
  // Payment permissions
  APPROVE_PAYMENTS: 'approve_payments',
  REJECT_PAYMENTS: 'reject_payments',
  VIEW_PAYMENT_HISTORY: 'view_payment_history',
  BULK_PAYMENT_OPERATIONS: 'bulk_payment_operations',
  
  // Room permissions
  ASSIGN_ROOMS: 'assign_rooms',
  MANAGE_ROOM_STATUS: 'manage_room_status',
  VIEW_ROOM_DETAILS: 'view_room_details',
  
  // Student permissions
  VIEW_STUDENT_DATA: 'view_student_data',
  MANAGE_STUDENTS: 'manage_students',
  SEND_MESSAGES: 'send_messages',
  
  // System permissions
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
  VIEW_AUDIT_LOG: 'view_audit_log',
  SYSTEM_SETTINGS: 'system_settings'
};

export const ROLE_PERMISSIONS = {
  [ROLES.SENIOR_CUSTODIAN]: [
    PERMISSIONS.APPROVE_PAYMENTS,
    PERMISSIONS.REJECT_PAYMENTS,
    PERMISSIONS.VIEW_PAYMENT_HISTORY,
    PERMISSIONS.BULK_PAYMENT_OPERATIONS,
    PERMISSIONS.ASSIGN_ROOMS,
    PERMISSIONS.MANAGE_ROOM_STATUS,
    PERMISSIONS.VIEW_ROOM_DETAILS,
    PERMISSIONS.VIEW_STUDENT_DATA,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.SEND_MESSAGES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.VIEW_AUDIT_LOG,
    PERMISSIONS.SYSTEM_SETTINGS
  ],
  [ROLES.JUNIOR_CUSTODIAN]: [
    PERMISSIONS.VIEW_PAYMENT_HISTORY,
    PERMISSIONS.ASSIGN_ROOMS,
    PERMISSIONS.VIEW_ROOM_DETAILS,
    PERMISSIONS.VIEW_STUDENT_DATA,
    PERMISSIONS.SEND_MESSAGES,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  [ROLES.MAINTENANCE_STAFF]: [
    PERMISSIONS.VIEW_ROOM_DETAILS,
    PERMISSIONS.MANAGE_ROOM_STATUS
  ]
};

export const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

export const canAccessFeature = (userRole, feature) => {
  switch (feature) {
    case 'payment_management':
      return hasPermission(userRole, PERMISSIONS.VIEW_PAYMENT_HISTORY);
    case 'room_management':
      return hasPermission(userRole, PERMISSIONS.VIEW_ROOM_DETAILS);
    case 'analytics':
      return hasPermission(userRole, PERMISSIONS.VIEW_ANALYTICS);
    case 'audit_log':
      return hasPermission(userRole, PERMISSIONS.VIEW_AUDIT_LOG);
    default:
      return false;
  }
};