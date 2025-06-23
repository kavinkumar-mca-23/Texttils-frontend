import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; // ✅ import your header

const AdminLayout = ({ children }) => {
  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <Header /> {/* ✅ include header at the top */}
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: "rgb(241, 255, 252)",
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
};

export default AdminLayout;
