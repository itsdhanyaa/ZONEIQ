let crowdData = [];

exports.getCrowdData = async (req, res) => {
  try {
    const data = crowdData.filter(d => d.zoneId === req.params.zoneId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addCrowdData = async (req, res) => {
  try {
    const data = { _id: Date.now().toString(), ...req.body, timestamp: new Date() };
    crowdData.push(data);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPrediction = async (req, res) => {
  try {
    const data = crowdData.filter(d => d.zoneId === req.params.zoneId).slice(0, 10);
    res.json({ prediction: 'Prediction logic here', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
