import React from 'react';

const MapView = ({ zones }) => {
  const getZoneColor = (zone) => {
    const occupancy = (zone.currentCount / zone.maxCapacity) * 100;
    if (occupancy >= 90) return '#e74c3c';
    if (occupancy >= 70) return '#f39c12';
    return '#27ae60';
  };

  return (
    <div className="map-view">
      <h2>Zone Map</h2>
      {zones.length === 0 ? (
        <p>No zones available</p>
      ) : (
        <div className="map-container">
          {zones.map(zone => (
            <div
              key={zone._id}
              className="map-zone"
              style={{ backgroundColor: getZoneColor(zone) }}
              title={`${zone.name}: ${zone.currentCount}/${zone.maxCapacity}`}
            >
              {zone.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapView;
