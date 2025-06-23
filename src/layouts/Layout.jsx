import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Layout = ({ children }) => {
  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <Header />
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    width:"100vh",
    overflow: 'hidden',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f6f9fc',
    height: '100vh',
    overflowY: 'auto',
  },
  content: {
    padding: '20px',
    flexGrow: 1,
  },
};

export default Layout;
