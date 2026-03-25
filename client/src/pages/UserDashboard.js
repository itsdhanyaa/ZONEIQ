import React, { useState, useEffect } from 'react';
import { getZones } from '../services/api';
import { subscribeToCrowdUpdates, subscribeToZoneUpdates, socket } from '../services/socket';
import MapView from '../components/MapView';
import ComfortScore from '../components/ComfortScore';
import PanicButton from '../components/PanicButton';
import MiniPanicAlert from '../components/MiniPanicAlert';
import AdvancedFeatures from '../components/AdvancedFeatures';
import ZonePopularity from '../components/ZonePopularity';
import ZoneRedirection from '../components/ZoneRedirection';
import axios from 'axios';

const UserDashboard = () => {
  const [zones, setZones] = useState([]);
  const [comfortScore, setComfortScore] = useState(75);
  const [alertHistory, setAlertHistory] = useState([]);

  useEffect(() => {
    fetchZones();
    if (Notification.permission === 'default') Notification.requestPermission();

    const unsubscribeCrowd = subscribeToCrowdUpdates((data) => {
      setZones(prev => {
        const updated = prev.map(zone => 
          zone._id === data.zoneId ? { ...zone, currentCount: parseInt(data.currentCount), status: data.status } : zone
        );
        calculateComfortScore(updated);
        return updated;
      });
    });

    const unsubscribeZone = subscribeToZoneUpdates((data) => {
      setZones(prev => {
        const updated = prev.map(zone => 
          zone._id === data.zoneId ? { ...zone, currentCount: parseInt(data.currentCount), status: data.status } : zone
        );
        calculateComfortScore(updated);
        return updated;
      });
    });

    const handlePanicAlert = (data) => {
      if (Notification.permission === 'granted') {
        new Notification('🚨 Crowd Alert', {
          body: data.message,
          icon: '/favicon.ico'
        });
      }
      setAlertHistory(prev => [{ ...data, timestamp: new Date() }, ...prev]);
    };

    socket.on('panicAlert', handlePanicAlert);

    return () => {
      if (unsubscribeCrowd) unsubscribeCrowd();
      if (unsubscribeZone) unsubscribeZone();
      socket.off('panicAlert', handlePanicAlert);
    };
    // eslint-disable-next-line
  }, []);

  const fetchZones = async () => {
    try {
      const data = await getZones();
      setZones(data);
      calculateComfortScore(data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const calculateComfortScore = (zonesData) => {
    if (!zonesData || zonesData.length === 0) return;
    const avgOccupancy = zonesData.reduce((acc, zone) => {
      const occupancy = zone.maxCapacity > 0 ? (zone.currentCount / zone.maxCapacity) : 0;
      return acc + occupancy;
    }, 0) / zonesData.length;
    const score = Math.max(0, Math.min(100, Math.round((1 - avgOccupancy) * 100)));
    setComfortScore(score);
  };

  const handlePanic = async () => {
    try {
      await axios.post('http://localhost:5000/api/alerts', {
        zoneId: zones[0]?._id,
        type: 'panic',
        severity: 'critical',
        message: 'Emergency panic button activated!'
      });
      alert('Emergency alert sent to authorities!');
    } catch (error) {
      console.error('Error sending panic alert:', error);
      alert('Panic alert sent!');
    }
  };

  return (
    <div className="user-dashboard">
      <h1>👤 User Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem 0' }}>
        <button className="clear-alerts-btn" onClick={async () => {
          try {
            await axios.delete('http://localhost:5000/api/alerts/clear');
            await axios.post('http://localhost:5000/api/zones/reset');
            setZones(prev => prev.map(z => ({ ...z, currentCount: 0, status: 'safe' })));
            setAlertHistory([]);
            setComfortScore(100);
          } catch (e) {
            console.error('Clear error:', e);
            setZones(prev => prev.map(z => ({ ...z, currentCount: 0, status: 'safe' })));
            setAlertHistory([]);
            setComfortScore(100);
          }
        }}>
          🗑️ Clear All
        </button>
      </div>
      <ZoneRedirection zones={zones} />
      <ComfortScore score={comfortScore} />
      <AdvancedFeatures zones={zones} />
      <MapView zones={zones} />
      <MiniPanicAlert />
      <ZonePopularity zones={zones} />
      <PanicButton onPanic={handlePanic} />
    </div>
  );
};

export default UserDashboard;
