let zones = [];

const updateZoneFromImage = () => {
  if (global.latestZoneData) {
    const { zoneId, currentCount, status } = global.latestZoneData;
    const zoneIndex = zones.findIndex(z => z._id === zoneId);
    if (zoneIndex !== -1) {
      zones[zoneIndex].currentCount = currentCount;
      zones[zoneIndex].status = status;
    }
  }
};

exports.getZones = async (req, res) => {
  try {
    if (zones.length === 0) {
      zones = [
        { _id: '1', name: 'Zone A', location: 'North Wing', maxCapacity: 5, currentCount: 0, status: 'safe' },
        { _id: '2', name: 'Zone B', location: 'South Wing', maxCapacity: 2, currentCount: 0, status: 'safe' },
        { _id: '3', name: 'Zone C', location: 'East Wing', maxCapacity: 80, currentCount: 0, status: 'safe' }
      ];
    }
    updateZoneFromImage();
    res.json(zones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createZone = async (req, res) => {
  try {
    const zone = { _id: Date.now().toString(), ...req.body };
    zones.push(zone);
    res.status(201).json(zone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateZone = async (req, res) => {
  try {
    const index = zones.findIndex(z => z._id === req.params.id);
    if (index !== -1) {
      zones[index] = { ...zones[index], ...req.body };
      res.json(zones[index]);
    } else {
      res.status(404).json({ error: 'Zone not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    zones = zones.filter(z => z._id !== req.params.id);
    res.json({ message: 'Zone deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
