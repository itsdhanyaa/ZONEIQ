import React from 'react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="home">
      <h1>{user ? `Welcome, ${user.name} 👋` : 'Welcome to ZoneIQ'}</h1>
      <p>Smart Crowd Monitoring and Safety Management System</p>
      <p style={{ marginTop: '2rem', fontSize: '1rem' }}>
        Monitor crowd density in real-time and ensure public safety
      </p>
    </div>
  );
};

export default Home;
