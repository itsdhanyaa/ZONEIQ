import React, { useState, useEffect } from 'react';

const ZoneRedirection = ({ zones }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!zones || zones.length < 3) {
      setNotification(null);
      return;
    }

    const zone1 = zones.find(z => z._id === '1');
    const zone2 = zones.find(z => z._id === '2');
    const zone3 = zones.find(z => z._id === '3');

    if (!zone1 || zone1.maxCapacity === 0) {
      setNotification(null);
      return;
    }

    const occupancy1 = (zone1.currentCount / zone1.maxCapacity) * 100;
    
    if (occupancy1 >= 70) {
      const alternativeZones = [];
      
      if (zone2 && zone2.maxCapacity > 0) {
        const occupancy2 = (zone2.currentCount / zone2.maxCapacity) * 100;
        if (occupancy2 < 70) alternativeZones.push({ zone: zone2, occupancy: occupancy2 });
      }
      
      if (zone3 && zone3.maxCapacity > 0) {
        const occupancy3 = (zone3.currentCount / zone3.maxCapacity) * 100;
        if (occupancy3 < 70) alternativeZones.push({ zone: zone3, occupancy: occupancy3 });
      }

      if (alternativeZones.length > 0) {
        alternativeZones.sort((a, b) => a.occupancy - b.occupancy);
        const bestZone = alternativeZones[0].zone;
        
        setNotification({
          message: `⚠️ ${zone1.name} is ${occupancy1.toFixed(0)}% full!`,
          suggestion: `Please move to ${bestZone.name} (${alternativeZones[0].occupancy.toFixed(0)}% occupied)`,
          severity: occupancy1 >= 90 ? 'critical' : 'warning'
        });
      } else {
        setNotification({
          message: `🚨 All zones are crowded!`,
          suggestion: `Please wait or try again later`,
          severity: 'critical'
        });
      }
    } else {
      setNotification(null);
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
