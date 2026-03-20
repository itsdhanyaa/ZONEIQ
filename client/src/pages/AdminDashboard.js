import React, { useState, useEffect } from 'react';
import { getZones, getAlerts } from '../services/api';
import { subscribeToAlerts, subscribeToCrowdUpdates, subscribeToZoneUpdates } from '../services/socket';
import ZoneCard from '../components/ZoneCard';
import AlertPanel from '../components/AlertPanel';
import ImageUpload from '../components/ImageUpload';
import AnimatedStats from '../components/AnimatedStats';
import LiveClock from '../components/LiveClock';
import AdvancedFeatures from '../components/AdvancedFeatures';
import ZonePopularity from '../components/ZonePopularity';
import ZoneRedirection from '../components/ZoneRedirection';

const AdminDashboard = () => {
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    const unsubscribeAlerts = subscribeToAlerts((alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    const unsubscribeCrowd = subscribeToCrowdUpdates((data) => {
      setZones(prev => prev.map(zone => 
        zone._id === data.zoneId ? { ...zone, currentCount: parseInt(data.currentCount) || 0, status: data.status } : zone
      ));
    });

    const unsubscribeZone = subscribeToZoneUpdates((data) => {
      setZones(prev => prev.map(zone => 
        zone._id === data.zoneId ? { ...zone, currentCount: parseInt(data.currentCount) || 0, status: data.status } : zone
      ));
    });

    return () => {
      if (unsubscribeAlerts) unsubscribeAlerts();
      if (unsubscribeCrowd) unsubscribeCrowd();
      if (unsubscribeZone) unsubscribeZone();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [zonesData, alertsData] = await Promise.all([getZones(), getAlerts()]);
      setZones(zonesData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-dashboard"><h1>Loading...</h1></div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>🎯 Admin Dashboard</h1>
        <LiveClock />
      </div>
      <ZoneRedirection zones={zones} />
      <AnimatedStats zones={zones} />
      <AdvancedFeatures zones={zones} />
      
      <div className="upload-zones">
        <ImageUpload zoneId="1" zoneName="Zone A" />
        <ImageUpload zoneId="2" zoneName="Zone B" />
        <ImageUpload zoneId="3" zoneName="Zone C" />
      </div>
      
      <AlertPanel alerts={alerts} />
      <ZonePopularity zones={zones} />
      <div className="zones-grid">
        {zones.map(zone => <ZoneCard key={zone._id} zone={zone} />)}
      </div>
    </div>
  );
};

export default AdminDashboard;
