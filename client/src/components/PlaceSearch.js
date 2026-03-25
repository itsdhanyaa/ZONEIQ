import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../services/socket';

const PlaceSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllPlaces();

    socket.on('placesUpdate', (updatedPlaces) => {
      setPlaces(updatedPlaces);
      if (!searchQuery.trim()) setFilteredPlaces(updatedPlaces);
    });

    return () => socket.off('placesUpdate');
    // eslint-disable-next-line
  }, []);

  const fetchAllPlaces = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/places');
      setPlaces(response.data);
      setFilteredPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPlaces(places);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/places/search?q=${query}`);
      setFilteredPlaces(response.data);
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  const getCrowdColor = (status) => {
    if (status === 'Critical') return '#e74c3c';
    if (status === 'Warning') return '#f39c12';
    return '#27ae60';
  };

  const getRecommendation = (status, peakTime) => {
    if (status === 'Safe') return '✅ Great time to visit!';
    if (status === 'Warning') return `⚠️ Moderate crowd. Avoid ${peakTime}`;
    return `🚫 Very crowded! Visit after ${peakTime}`;
  };

  if (loading) return <div className="place-search"><h2 style={{ color: 'white' }}>Loading places...</h2></div>;

  return (
    <div className="place-search">
      <div className="search-header">
        <h1>🗺️ Famous Places in India</h1>
        <p>Live crowd levels updated every 4 seconds</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by place name, city, or state..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="places-grid">
        {filteredPlaces.length === 0 ? (
          <p className="no-results">No places found. Try a different search.</p>
        ) : (
          filteredPlaces.map(place => (
            <div key={place._id} className="place-card">
              <div className="place-header">
                <h3>{place.name}</h3>
                <span className="place-category">{place.category}</span>
              </div>

              <p className="place-location">📍 {place.city}, {place.state}</p>

              <div className="crowd-info">
                <div className="crowd-status" style={{ backgroundColor: getCrowdColor(place.crowdStatus) }}>
                  <span className="status-label">{place.crowdStatus}</span>
                  <span className="status-percentage">{place.crowdPercentage}%</span>
                </div>

                <div className="crowd-details">
                  <p><strong>👥 Current:</strong> {place.currentCrowd.toLocaleString()}</p>
                  <p><strong>📊 Capacity:</strong> {place.maxCapacity.toLocaleString()}</p>
                  <p><strong>⏰ Peak Time:</strong> {place.peakTime}</p>
                  {place.bestTimeToVisit && (
                    <p style={{ color: '#27ae60' }}><strong>🕐</strong> {place.bestTimeToVisit}</p>
                  )}
                </div>
              </div>

              <div className="recommendation" style={{
                backgroundColor: getCrowdColor(place.crowdStatus) + '20',
                borderLeft: `4px solid ${getCrowdColor(place.crowdStatus)}`
              }}>
                {getRecommendation(place.crowdStatus, place.peakTime)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaceSearch;
