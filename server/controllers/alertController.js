let alerts = [];

exports.getAlerts = async (req, res) => {
  try {
    res.json(alerts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const alert = { _id: Date.now().toString(), ...req.body, timestamp: new Date() };
    alerts.unshift(alert);
    if (alerts.length > 10) alerts = alerts.slice(0, 10);
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addAlertFromZone = (zoneId, zoneName, currentCount, maxCapacity, status) => {
  const occupancy = ((currentCount / maxCapacity) * 100).toFixed(1);
  const severity = status === 'critical' ? 'critical' : 'high';
  const message = `${status === 'critical' ? 'CRITICAL' : 'WARNING'}: ${zoneName} at ${occupancy}% capacity (${currentCount}/${maxCapacity})`;
  const newAlert = {
    _id: Date.now().toString(),
    zoneId,
    type: 'overcrowding',
    severity,
    message,
    resolved: false,
    timestamp: new Date()
  };
  alerts.unshift(newAlert);
  if (alerts.length > 10) alerts = alerts.slice(0, 10);
};

exports.resolveAlert = async (req, res) => {
  try {
    const index = alerts.findIndex(a => a._id === req.params.id);
    if (index !== -1) {
      alerts[index].resolved = true;
      res.json(alerts[index]);
    } else {
      res.status(404).json({ error: 'Alert not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.clearAllAlerts = async (req, res) => {
  try {
    alerts = [];
    global.latestZoneData = null;
    res.json({ message: 'All alerts cleared' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
