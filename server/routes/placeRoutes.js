const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllPlaces, searchPlaces, getPlaceById, updatePlaceCrowd } = require('../controllers/placeController');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', getAllPlaces);
router.get('/search', searchPlaces);
router.get('/:id', getPlaceById);

router.post('/:id/analyze', upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const detectedCount = Math.max(0, parseInt(req.body.detectedCount) || 0);
    const io = req.app.get('io');

    const updated = updatePlaceCrowd(id, detectedCount, io);

    if (!updated) {
      return res.status(404).json({ error: 'Place not found' });
    }

    res.json({
      success: true,
      placeId: id,
      name: updated.name,
      currentCrowd: updated.currentCrowd,
      maxCapacity: updated.maxCapacity,
      crowdPercentage: updated.crowdPercentage,
      crowdStatus: updated.crowdStatus,
      peakTime: updated.peakTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Place analyze error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
