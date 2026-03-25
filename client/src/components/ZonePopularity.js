import React from 'react';

const ZonePopularity = ({ zones }) => {
  const getPopularityRating = (zone) => {
    if (!zone || zone.maxCapacity === 0) {
      return { stars: 1, label: 'No Data' };
    }
    const occupancy = (zone.currentCount / zone.maxCapacity) * 100;
    if (occupancy >= 80) return { stars: 5, label: 'Very Popular' };
    if (occupancy >= 60) return { stars: 4, label: 'Popular' };
    if (occupancy >= 40) return { stars: 3, label: 'Moderate' };
    if (occupancy >= 20) return { stars: 2, label: 'Low Traffic' };
    return { stars: 1, label: 'Very Quiet' };
  };

  return (
    <div className="zone-popularity">
      <h2>🌟 Zone Popularity Ratings</h2>
      <div className="popularity-list">
        {zones.map(zone => {
          const rating = getPopularityRating(zone);
          return (
            <div key={zone._id} className="popularity-item">
              <span className="zone-name">{zone.name}</span>
              <span className="stars">{'⭐'.repeat(rating.stars)}</span>
              <span className="rating-label">{rating.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ZonePopularity;
