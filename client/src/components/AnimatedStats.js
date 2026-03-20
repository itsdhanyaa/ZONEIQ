import React, { useState, useEffect } from 'react';

const AnimatedStats = ({ zones }) => {
  const [totalPeople, setTotalPeople] = useState(0);
  const [avgOccupancy, setAvgOccupancy] = useState(0);
  const [criticalZones, setCriticalZones] = useState(0);

  useEffect(() => {
    if (zones.length > 0) {
      const total = zones.reduce((sum, zone) => sum + zone.currentCount, 0);
      const avg = zones.reduce((sum, zone) => sum + (zone.currentCount / zone.maxCapacity) * 100, 0) / zones.length;
      const critical = zones.filter(zone => zone.status === 'critical').length;
      
      animateValue(0, total, 1000, setTotalPeople);
      animateValue(0, avg, 1000, setAvgOccupancy);
      animateValue(0, critical, 500, setCriticalZones);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zones]);

  const animateValue = (start, end, duration, setter) => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setter(Math.round(end));
        clearInterval(timer);
      } else {
        setter(Math.round(current));
      }
    }, 16);
  };

  return (
    <div className="animated-stats">
      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-value">{totalPeople}</div>
        <div className="stat-label">Total People</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-value">{avgOccupancy.toFixed(1)}%</div>
        <div className="stat-label">Avg Occupancy</div>
      </div>
      <div className="stat-card critical">
        <div className="stat-icon">⚠️</div>
        <div className="stat-value">{criticalZones}</div>
        <div className="stat-label">Critical Zones</div>
      </div>
    </div>
  );
};

export default AnimatedStats;
