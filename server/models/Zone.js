const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  maxCapacity: { type: Number, required: true },
  currentCount: { type: Number, default: 0 },
  status: { type: String, enum: ['safe', 'warning', 'critical'], default: 'safe' },
  coordinates: {
    lat: Number,
    lng: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Zone', zoneSchema);
