import React from 'react';
import { NavLink } from 'react-router-dom';

const studentLinks = [
  { to: "/dashboard", icon: "fa-house-user", text: "Dashboard" },
  { to: "/my-bookings", icon: "fa-file-invoice", text: "My Bookings" },
  { to: "/maintenance", icon: "fa-screwdriver-wrench", text: "Maintenance" },
  { to: "/profile", icon: "fa-user-pen", text: "My Profile" },
];

const custodianLinks = [
    { to: "/custodian-dashboard", icon: "fa-inbox", text: "Dashboard" },
    { to: "/custodian-payment-management", icon: "fa-file-invoice-dollar", text: "Payment Management" },
    { to: "/custodian-room-assignment", icon: "fa-key", text: "Room Assignment" },
    { to: "/custodian-room-management", icon: "fa-bed", text: "Room Management" },
    { to: "/custodian-students", icon: "fa-users", text: "Student Management" },
    { to: "/custodian-analytics", icon: "fa-chart-line", text: "Analytics & Reports" },
    { to: "/custodian-maintenance", icon: "fa-screwdriver-wrench", text: "Maintenance" },
    { to: "/custodian-profile", icon: "fa-user-pen", text: "My Profile" },
];

const DashboardSidebar = ({ user, onLogout, role = 'student' }) => {
  const links = role === 'custodian' ? custodianLinks : studentLinks;

  return (
    <aside className={`dashboard-sidebar ${role === 'custodian' ? 'custodian-sidebar' : ''}`} data-role={role}>
      <div className="profile-summary horizontal-layout">
        <img 
          src={user.profilePicture || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23f0f0f0'/%3E%3Cpath d='M40 24c-6 0-11 5-11 11s5 11 11 11 11-5 11-11-5-11-11-11zm0 48c-13 0-24-6-24-14 0-8 11-14 24-14s24 6 24 14c0 8-11 14-24 14z' fill='%23ccc'/%3E%3C/svg%3E"} 
          alt={`${user.fullName} profile`} 
          className="profile-avatar"
        />
        <div className="profile-info">
          <h4>{user.fullName || user.name}</h4>
          <p>{role === 'custodian' ? 'Custodian' : (user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student')}</p>
        </div>
      </div>
      <nav className="dashboard-nav">
        {links.map(link => <NavLink key={link.to} to={link.to} className="dashboard-link"><i className={`fa-solid ${link.icon}`}></i> {link.text}</NavLink>)}
        <button className="dashboard-link logout" onClick={onLogout}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;