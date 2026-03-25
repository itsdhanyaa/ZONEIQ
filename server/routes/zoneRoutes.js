const express = require('express');
const router = express.Router();
const { getZones, createZone, updateZone, deleteZone, resetZones } = require('../controllers/zoneController');

router.get('/', getZones);
router.post('/', createZone);
router.post('/reset', resetZones);
router.put('/:id', updateZone);
router.delete('/:id', deleteZone);

module.exports = router;
