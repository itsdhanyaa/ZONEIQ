import React from 'react';

const ZoneCard = ({ zone }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'safe': return '#27ae60';
      case 'warning': return '#f39c12';
      case 'critical': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const occupancyPercentage = zone.maxCapacity > 0 
    ? Math.min(100, ((zone.currentCount / zone.maxCapacity) * 100)).toFixed(1)
    : 0;

  return (
    <div className="zone-card" style={{ borderLeftColor: getStatusColor(zone.status) }}>
      <div className="zone-header">
        <h3>{zone.name}</h3>
        <span className={`status-badge ${zone.status}`}>{zone.status.toUpperCase()}</span>
      </div>
      <p><strong>📍 Location:</strong> {zone.location}</p>
      <div className="capacity-bar">
        <div className="capacity-fill" style={{ width: `${occupancyPercentage}%`, backgroundColor: getStatusColor(zone.status) }}></div>
      </div>
      <p><strong>👥 Capacity:</strong> {zone.currentCount}/{zone.maxCapacity}</p>
      <p><strong>📊 Occupancy:</strong> {occupancyPercentage}%</p>
    </div>
  );
};

export default ZoneCard;
