import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTshirt, FaShippingFast, FaBoxOpen, FaMoneyBill, FaStar,
  FaBullhorn, FaSignOutAlt, FaThLarge, FaCloudUploadAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const getLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    color: isActive ? '#009688' : '#000',
    textDecoration: 'none',
    fontSize: '16px',
    borderRadius: '6px',
    marginBottom: '10px',
    backgroundColor: isActive ? '#e0f2f1' : 'transparent',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.3s ease',
  });

  const iconStyle = {
    marginRight: '10px',
    fontSize: '18px',
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>.cloths</h2>

      {[
        { to: '/admin/dashboard', label: 'Dashboard', icon: <FaThLarge style={iconStyle} /> },
        { to: '/admin/upload-products', label: 'Upload Products', icon: <FaCloudUploadAlt style={iconStyle} /> },
        { to: '/admin/orders', label: 'Orders', icon: <FaBoxOpen style={iconStyle} /> },
        { to: '/admin/DeliveryTracking', label: 'Delivery', icon: <FaShippingFast style={iconStyle} /> },
        { to: '/admin/stocks', label: 'Stocks', icon: <FaTshirt style={iconStyle} /> },
        { to: '/admin/Expense', label: 'Expense', icon: <FaMoneyBill style={iconStyle} /> },
        { to: '/admin/reviews', label: 'Reviews', icon: <FaStar style={iconStyle} /> },
        { to: '/admin/Advertisement', label: 'Advertisement', icon: <FaBullhorn style={iconStyle} /> },
      ].map(({ to, label, icon }) => (
        <NavLink key={to} to={to} style={getLinkStyle}>
          {icon} {label}
        </NavLink>
      ))}

      <div
        onClick={handleLogout}
        style={{
          ...getLinkStyle({ isActive: false }),
          color: '#e74c3c',
          cursor: 'pointer',
        }}
      >
        <FaSignOutAlt style={iconStyle} /> Log Out
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
    borderRight: '1px solid #ccc',
  },
  logo: {
    fontSize: '24px',
    color: '#009688', // ✅ green color logo
    marginBottom: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

export default Sidebar;
