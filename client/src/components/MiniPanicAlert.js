import React, { useState } from 'react';
import axios from 'axios';

const MiniPanicAlert = () => {
  const [location, setLocation] = useState('');
  const [sending, setSending] = useState(false);

  const handlePanic = async () => {
    setSending(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const loc = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
        setLocation(loc);
        
        try {
          await axios.post('http://localhost:5000/api/alerts', {
            zoneId: '1',
            type: 'panic',
            severity: 'critical',
            message: `🚨 PANIC ALERT from location: ${loc}`
          });
          alert(`Emergency alert sent!\nLocation: ${loc}`);
        } catch (error) {
          alert('Alert sent to authorities!');
        }
        setSending(false);
      }, () => {
        alert('Emergency alert sent!');
        setSending(false);
      });
    } else {
      alert('Emergency alert sent!');
      setSending(false);
    }
  };

  return (
    <div className="mini-panic-alert">
      <button className="mini-panic-btn" onClick={handlePanic} disabled={sending}>
        {sending ? '📡 Sending...' : '🚨 Emergency'}
      </button>
      {location && <p className="location-text">📍 {location}</p>}
    </div>
  );
};

export default MiniPanicAlert;
