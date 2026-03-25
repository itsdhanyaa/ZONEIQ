import React from 'react';
import axios from 'axios';

const AlertPanel = ({ alerts, onClear }) => {
  const handleClearAlerts = async () => {
    try {
      await axios.delete('http://localhost:5000/api/alerts/clear');
      if (onClear) onClear();
    } catch (error) {
      console.error('Error clearing alerts:', error);
    }
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="alert-panel">
        <div className="alert-header">
          <h2>Active Alerts ({alerts?.length || 0})</h2>
        </div>
        <p>No active alerts at this time.</p>
      </div>
    );
  }

  return (
    <div className="alert-panel">
      <div className="alert-header">
        <h2>Active Alerts ({alerts.length})</h2>
        <button className="clear-alerts-btn" onClick={handleClearAlerts}>
          🗑️ Clear All
        </button>
      </div>
      {alerts.slice(0, 5).map((alert, index) => (
        <div key={alert._id || index} className={`alert ${alert.severity}`}>
          <p><strong>{alert.type.toUpperCase()}:</strong> {alert.message}</p>
          <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
            {new Date(alert.timestamp).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AlertPanel;
