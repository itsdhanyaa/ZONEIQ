const mongoose = require('mongoose');

const crowdDataSchema = new mongoose.Schema({
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
  count: { type: Number, required: true },
  density: { type: Number },
  temperature: { type: Number },
  humidity: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CrowdData', crowdDataSchema);
