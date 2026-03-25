import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav>
      <h1>ZoneIQ</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/places">Famous Places</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/admin">Admin</Link>
        {!user && <Link to="/signup">Sign Up</Link>}
        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #c4b5fd', color: '#c4b5fd', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
