const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/analyze', upload.single('image'), (req, res) => {
  try {
    const { zoneId, detectedCount } = req.body;
    const estimatedCount = Math.max(0, parseInt(detectedCount) || 0);

    const { getZoneCapacity, updateZoneData, getZoneName } = require('../controllers/zoneController');
    const { addAlertFromZone } = require('../controllers/alertController');

    const maxCapacity = getZoneCapacity(zoneId);
    const zoneName = getZoneName(zoneId);
    const occupancy = Math.min(100, (estimatedCount / maxCapacity) * 100);

    let status = 'safe';
    let severity = 'low';
    let alertMessage = '';

    if (occupancy >= 90) {
      status = 'critical';
      severity = 'critical';
      alertMessage = `🚨 CRITICAL ALERT: ${estimatedCount} persons detected! Zone at ${occupancy.toFixed(1)}% capacity (${estimatedCount}/${maxCapacity}). Immediate action required!`;
    } else if (occupancy >= 70) {
      status = 'warning';
      severity = 'high';
      alertMessage = `⚠️ WARNING: ${estimatedCount} persons detected. Zone at ${occupancy.toFixed(1)}% capacity (${estimatedCount}/${maxCapacity}). Monitor closely.`;
    } else {
      alertMessage = `✅ SAFE: ${estimatedCount} persons detected. Zone is safe at ${occupancy.toFixed(1)}% capacity (${estimatedCount}/${maxCapacity}).`;
    }

    updateZoneData(zoneId, estimatedCount, status);

    if (status !== 'safe') {
      addAlertFromZone(zoneId, zoneName, estimatedCount, maxCapacity, status);
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('zoneUpdate', { zoneId, currentCount: estimatedCount, status, occupancy: occupancy.toFixed(1) });
      io.emit('crowdUpdate', { zoneId, currentCount: estimatedCount, status, occupancy: occupancy.toFixed(1) });

      if (status === 'warning' || status === 'critical') {
        io.emit('panicAlert', {
          zoneId,
          zoneName,
          message: `🚨 ${zoneName} is ${status === 'critical' ? 'CRITICALLY' : ''} overcrowded! ${estimatedCount}/${maxCapacity} persons detected. Please avoid ${zoneName}.`,
          status,
          occupancy: occupancy.toFixed(1)
        });
      }
    }

    res.json({
      success: true,
      estimatedCount,
      maxCapacity,
      occupancy: occupancy.toFixed(1),
      status,
      severity,
      alert: alertMessage,
      imagePath: req.file ? req.file.path : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
