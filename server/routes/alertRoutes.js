const express = require('express');
const router = express.Router();
const { getAlerts, createAlert, resolveAlert, clearAllAlerts } = require('../controllers/alertController');

router.get('/', getAlerts);
router.post('/', createAlert);
router.put('/:id/resolve', resolveAlert);
router.delete('/clear', clearAllAlerts);

module.exports = router;
