const { estimateCrowd, getCrowdStatus, getBestTimeToVisit } = require('../utils/crowdEstimator');

let places = [];
let io = null;

const initializePlaces = () => {
  if (places.length === 0) {
    const famousPlaces = require('../data/famousPlaces');
    places = famousPlaces.map((place, index) => ({
      _id: (index + 1).toString(),
      ...place,
      currentCrowd: estimateCrowd(place.maxCapacity)
    }));
  }
};

const withStatus = (place) => {
  const { percentage, status } = getCrowdStatus(place.currentCrowd, place.maxCapacity);
  return {
    ...place,
    crowdPercentage: percentage,
    crowdStatus: status,
    bestTimeToVisit: getBestTimeToVisit()
  };
};

const autoUpdateCrowds = () => {
  if (places.length === 0) return;
  places = places.map(place => ({
    ...place,
    currentCrowd: estimateCrowd(place.maxCapacity)
  }));
  if (io) {
    io.emit('placesUpdate', places.map(withStatus));
  }
};

exports.startAutoUpdate = (socketIo) => {
  io = socketIo;
  initializePlaces();
  setInterval(autoUpdateCrowds, 4000);
};

exports.getAllPlaces = async (req, res) => {
  try {
    initializePlaces();
    res.json(places.map(withStatus));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchPlaces = async (req, res) => {
  try {
    initializePlaces();
    const query = req.query.q?.toLowerCase() || '';
    if (!query) return res.json([]);
    const results = places.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.state.toLowerCase().includes(query)
    );
    res.json(results.map(withStatus));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    initializePlaces();
    const place = places.find(p => p._id === req.params.id);
    if (!place) return res.status(404).json({ error: 'Place not found' });
    res.json(withStatus(place));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePlaceCrowd = (placeId, detectedCount, socketIo) => {
  initializePlaces();
  const index = places.findIndex(p => p._id === placeId);
  if (index === -1) return null;
  places[index].currentCrowd = Math.max(0, detectedCount);
  const updated = withStatus(places[index]);
  if (socketIo) {
    socketIo.emit('placeUpdate', {
      placeId,
      currentCrowd: updated.currentCrowd,
      crowdPercentage: updated.crowdPercentage,
      crowdStatus: updated.crowdStatus
    });
  }
  return updated;
};

exports.getPlaces = () => {
  initializePlaces();
  return places;
};
