import React, { useState, useEffect } from 'react';

const ZoneRedirection = ({ zones }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!zones || zones.length === 0) {
      setNotification(null);
      return;
    }

    const crowdedZone = zones.find(z => z.maxCapacity > 0 && (z.currentCount / z.maxCapacity) * 100 >= 70);

    if (!crowdedZone) {
      setNotification(null);
      return;
    }

    const occupancy = (crowdedZone.currentCount / crowdedZone.maxCapacity) * 100;
    const alternatives = zones
      .filter(z => z._id !== crowdedZone._id && z.maxCapacity > 0 && (z.currentCount / z.maxCapacity) * 100 < 70)
      .sort((a, b) => (a.currentCount / a.maxCapacity) - (b.currentCount / b.maxCapacity));

    if (alternatives.length > 0) {
      const best = alternatives[0];
      const bestOccupancy = ((best.currentCount / best.maxCapacity) * 100).toFixed(0);
      setNotification({
        message: `⚠️ ${crowdedZone.name} is ${occupancy.toFixed(0)}% full!`,
        suggestion: `Please move to ${best.name} (${bestOccupancy}% occupied)`,
        severity: occupancy >= 90 ? 'critical' : 'warning'
      });
    } else {
      setNotification({
        message: `🚨 All zones are crowded!`,
        suggestion: `Please wait or try again later`,
        severity: 'critical'
      });
    }
  }, [zones]);

  if (!notification) return null;

  return (
    <div className={`zone-redirection ${notification.severity}`}>
      <div className="notification-icon">
        {notification.severity === 'critical' ? '🚨' : '⚠️'}
      </div>
      <div className="notification-content">
        <h3>{notification.message}</h3>
        <p>{notification.suggestion}</p>
      </div>
    </div>
  );
};

export default ZoneRedirection;
