import React, { useState, useEffect } from 'react';

const AdvancedFeatures = ({ zones }) => {
  const [peakHour, setPeakHour] = useState('');
  const [waitTime, setWaitTime] = useState(0);
  const [suggestedZone, setSuggestedZone] = useState(null);
  const [earlyWarning, setEarlyWarning] = useState(null);

  useEffect(() => {
    if (zones.length > 0) {
      detectPeakHour();
      calculateWaitTime();
      suggestBestZone();
      checkEarlyWarning();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zones]);

  const detectPeakHour = () => {
    const crowdedZones = zones.filter(z => {
      if (z.maxCapacity === 0) return false;
      const occupancy = (z.currentCount / z.maxCapacity) * 100;
      return occupancy >= 70;
    });

    if (crowdedZones.length > 0) {
      const names = crowdedZones.map(z => z.name).join(', ');
      setPeakHour(`🔴 Peak Hour at ${names}`);
    } else {
      setPeakHour('🟢 No Peak Hour - All Zones Normal');
    }
  };

  const calculateWaitTime = () => {
    if (zones.length === 0) {
      setWaitTime(0);
      return;
    }
    const avgOccupancy = zones.reduce((sum, z) => {
      const occupancy = z.maxCapacity > 0 ? (z.currentCount / z.maxCapacity) : 0;
      return sum + occupancy;
    }, 0) / zones.length;
    const time = Math.max(0, Math.round(avgOccupancy * 30));
    setWaitTime(time);
  };

  const suggestBestZone = () => {
    if (zones.length === 0) {
      setSuggestedZone(null);
      return;
    }
    const safestZone = zones
      .filter(z => z.status === 'safe' && z.maxCapacity > 0)
      .sort((a, b) => (a.currentCount / a.maxCapacity) - (b.currentCount / b.maxCapacity))[0];
    setSuggestedZone(safestZone || null);
  };

  const checkEarlyWarning = () => {
    if (zones.length === 0) {
      setEarlyWarning(null);
      return;
    }
    const warningZone = zones.find(z => {
      if (z.maxCapacity === 0) return false;
      const occupancy = (z.currentCount / z.maxCapacity) * 100;
      return occupancy >= 65 && occupancy < 70;
    });
    setEarlyWarning(warningZone || null);
  };

  return (
    <div className="advanced-features">
      <div className="feature-grid">
        <div className="feature-card peak-hour">
          <div className="feature-icon">⏰</div>
          <h3>Peak Hour Detection</h3>
          <p className="feature-value">{peakHour}</p>
        </div>

        <div className="feature-card wait-time">
          <div className="feature-icon">⏱️</div>
          <h3>Estimated Wait Time</h3>
          <p className="feature-value">{waitTime} minutes</p>
        </div>

        {suggestedZone && (
          <div className="feature-card suggestion">
            <div className="feature-icon">💡</div>
            <h3>Smart Zone Suggestion</h3>
            <p className="feature-value">{suggestedZone.name}</p>
            <p className="feature-detail">
              {((suggestedZone.currentCount / suggestedZone.maxCapacity) * 100).toFixed(0)}% occupied
            </p>
          </div>
        )}

        {earlyWarning && (
          <div className="feature-card warning">
            <div className="feature-icon">⚠️</div>
            <h3>Early Warning</h3>
            <p className="feature-value">{earlyWarning.name}</p>
            <p className="feature-detail">Approaching capacity threshold</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFeatures;
