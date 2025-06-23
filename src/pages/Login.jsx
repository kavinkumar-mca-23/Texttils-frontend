import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const registeredUser = {
      name: 'Kavin',
      username: 'admin',
      password: 'admin123',
      profilePic: '/assets/my-pic.jpg',
    };

    if (username === registeredUser.username && password === registeredUser.password) {
      localStorage.setItem('adminUser', JSON.stringify({
        name: registeredUser.name,
        username: registeredUser.username,
        profilePic: registeredUser.profilePic,
      }));
      navigate('/admin/dashboard');
    } else {
      alert('Invalid username or password!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Admin Login</h2>

        <div style={styles.hintBox}>
          <center><h5 style={{color:'green'}}>Use this...</h5></center>
          <p style={styles.hint}><strong>Username:</strong> admin</p>
          <p style={styles.hint}><strong>Password:</strong> admin123</p>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f4f8f7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  box: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: 420,
  },
  heading: {
    textAlign: 'center',
    marginBottom: 25,
    color: '#2e7d32',
    fontSize: 24,
  },
  hintBox: {
    marginBottom: 20,
    padding: '10px 12px',
    backgroundColor: '#e8f5e9',
    border: '1px solid #c8e6c9',
    borderRadius: 6,
  },
  hint: {
    fontSize: 14,
    margin: '5px 0',
    color: '#2e7d32',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#2e7d32',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default Login;
