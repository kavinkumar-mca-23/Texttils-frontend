import React, { useState } from 'react';
import '../styles/Header.css';
import myPic from '../assets/my-pic.jpg';
import { FaBell } from 'react-icons/fa';

const Header = () => {
  const admin = JSON.parse(localStorage.getItem('adminUser'));

  const [showNotification, setShowNotification] = useState(false);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <div className="header">
      <input type="text" placeholder="Search..." className="header-search" />

      <div className="header-right">
        {/* 🔔 Notification Icon */}
        <div className="notification-wrapper">
          <FaBell
            className="notification-icon"
            onClick={toggleNotification}
            style={{ color: 'green', cursor: 'pointer', fontSize: '18px' }}
          />
          <span className="notification-dot" />
          {showNotification && (
            <div className="notification-dropdown">
              <p>🛒 New order from Kavin</p>
              <p>🛒 New order from Priya</p>
            </div>
          )}
        </div>

        {/* 👤 Profile */}
        <div className="header-profile">
          <img
            src={admin?.profilePic || myPic}
            alt="profile"
            className="header-image"
          />
          <div>
            <div className="header-name">{admin?.name || 'Admin Name'}</div>
            <div className="header-role">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
