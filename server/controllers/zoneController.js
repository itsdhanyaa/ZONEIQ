let zones = [];

const ZONE_CAPACITIES = { '1': 5, '2': 2, '3': 80 };

exports.getZoneCapacity = (zoneId) => ZONE_CAPACITIES[zoneId] || 100;

exports.getZones = async (req, res) => {
  try {
    if (zones.length === 0) {
      zones = [
        { _id: '1', name: 'Zone A', location: 'North Wing', maxCapacity: ZONE_CAPACITIES['1'], currentCount: 0, status: 'safe' },
        { _id: '2', name: 'Zone B', location: 'South Wing', maxCapacity: ZONE_CAPACITIES['2'], currentCount: 0, status: 'safe' },
        { _id: '3', name: 'Zone C', location: 'East Wing', maxCapacity: ZONE_CAPACITIES['3'], currentCount: 0, status: 'safe' }
      ];
    }
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

exports.updateZoneData = (zoneId, currentCount, status) => {
  if (zones.length === 0) return;
  const index = zones.findIndex(z => z._id === zoneId);
  if (index !== -1) {
    zones[index].currentCount = currentCount;
    zones[index].status = status;
  }
};

exports.getZoneName = (zoneId) => {
  const zone = zones.find(z => z._id === zoneId);
  return zone ? zone.name : `Zone ${zoneId}`;
};

exports.resetZones = async (req, res) => {
  try {
    zones = [
      { _id: '1', name: 'Zone A', location: 'North Wing', maxCapacity: ZONE_CAPACITIES['1'], currentCount: 0, status: 'safe' },
      { _id: '2', name: 'Zone B', location: 'South Wing', maxCapacity: ZONE_CAPACITIES['2'], currentCount: 0, status: 'safe' },
      { _id: '3', name: 'Zone C', location: 'East Wing', maxCapacity: ZONE_CAPACITIES['3'], currentCount: 0, status: 'safe' }
    ];
    global.latestZoneData = null;
    res.json({ message: 'Zones reset' });
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
