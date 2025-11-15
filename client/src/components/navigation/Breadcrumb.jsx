import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Constants
const DEFAULT_BREADCRUMB_NAMES = {
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

const HOME_ROUTE = '/custodian-dashboard';
const HOME_LABEL = 'Dashboard';

// Helper functions
const parsePathnames = (pathname) => {
  return pathname.split('/').filter(x => x);
};

const buildRoutePath = (pathnames, index) => {
  return `/${pathnames.slice(0, index + 1).join('/')}`;
};

const getDisplayName = (name, breadcrumbNames) => {
  return breadcrumbNames[name] || name;
};

const isLastItem = (index, totalLength) => {
  return index === totalLength - 1;
};

// Components
const HomeLink = () => (
  <Link to={HOME_ROUTE} className="breadcrumb-item">
    <i className="fa-solid fa-home"></i>
    {HOME_LABEL}
  </Link>
);

const BreadcrumbLink = ({ name, routeTo, displayName }) => (
  <Link key={name} to={routeTo} className="breadcrumb-item">
    <i className="fa-solid fa-chevron-right"></i>
    {displayName}
  </Link>
);

BreadcrumbLink.propTypes = {
  name: PropTypes.string.isRequired,
  routeTo: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired
};

const BreadcrumbSpan = ({ name, displayName }) => (
  <span key={name} className="breadcrumb-item active">
    <i className="fa-solid fa-chevron-right"></i>
    {displayName}
  </span>
);

BreadcrumbSpan.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired
};

const BreadcrumbItem = ({ name, index, pathnames, breadcrumbNames }) => {
  const routeTo = buildRoutePath(pathnames, index);
  const displayName = getDisplayName(name, breadcrumbNames);
  const isLast = isLastItem(index, pathnames.length);

  return isLast ? (
    <BreadcrumbSpan name={name} displayName={displayName} />
  ) : (
    <BreadcrumbLink name={name} routeTo={routeTo} displayName={displayName} />
  );
};

BreadcrumbItem.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  pathnames: PropTypes.arrayOf(PropTypes.string).isRequired,
  breadcrumbNames: PropTypes.object.isRequired
};

const Breadcrumb = ({ breadcrumbNames = DEFAULT_BREADCRUMB_NAMES }) => {
  const location = useLocation();
  const pathnames = parsePathnames(location.pathname);

  return (
    <nav className="breadcrumb">
      <HomeLink />
      {pathnames.map((name, index) => (
        <BreadcrumbItem 
          key={name}
          name={name}
          index={index}
          pathnames={pathnames}
          breadcrumbNames={breadcrumbNames}
        />
      ))}
    </nav>
  );
};

Breadcrumb.propTypes = {
  breadcrumbNames: PropTypes.object
};

export default Breadcrumb;