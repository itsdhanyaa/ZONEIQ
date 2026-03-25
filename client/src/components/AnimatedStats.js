import React, { useState, useEffect, useRef } from 'react';

const AnimatedStats = ({ zones }) => {
  const [totalPeople, setTotalPeople] = useState(0);
  const [avgOccupancy, setAvgOccupancy] = useState(0);
  const [criticalZones, setCriticalZones] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearInterval);
    timers.current = [];

    if (zones.length > 0) {
      const total = zones.reduce((sum, z) => sum + z.currentCount, 0);
      const avg = zones.reduce((sum, z) => sum + (z.maxCapacity > 0 ? (z.currentCount / z.maxCapacity) * 100 : 0), 0) / zones.length;
      const critical = zones.filter(z => z.status === 'critical').length;

      timers.current.push(animateValue(0, total, 1000, setTotalPeople));
      timers.current.push(animateValue(0, avg, 1000, setAvgOccupancy));
      timers.current.push(animateValue(0, critical, 500, setCriticalZones));
    }

    return () => timers.current.forEach(clearInterval);
  }, [zones]);

  const animateValue = (start, end, duration, setter) => {
    const steps = duration / 16;
    const increment = (end - start) / steps;
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if ((increment >= 0 && current >= end) || (increment < 0 && current <= end)) {
        setter(Math.round(end));
        clearInterval(timer);
      } else {
        setter(Math.round(current));
      }
    }, 16);
    return timer;
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
