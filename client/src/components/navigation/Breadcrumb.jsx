import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNames = {
    'custodian-dashboard': 'Dashboard',
    'custodian-payment-management': 'Payment Management',
    'custodian-room-assignment': 'Room Assignment',
    'custodian-room-management': 'Room Management',
    'custodian-students': 'Student Directory',
    'custodian-analytics': 'Analytics & Reports',
    'custodian-maintenance': 'Maintenance',
    'custodian-audit-log': 'Audit Log',
    'custodian-profile': 'My Profile'
  };

  return (
    <nav className="breadcrumb">
      <Link to="/custodian-dashboard" className="breadcrumb-item">
        <i className="fa-solid fa-home"></i>
        Dashboard
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = breadcrumbNames[name] || name;

        return isLast ? (
          <span key={name} className="breadcrumb-item active">
            <i className="fa-solid fa-chevron-right"></i>
            {displayName}
          </span>
        ) : (
          <Link key={name} to={routeTo} className="breadcrumb-item">
            <i className="fa-solid fa-chevron-right"></i>
            {displayName}
          </Link>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;