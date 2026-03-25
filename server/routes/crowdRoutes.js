const express = require('express');
const router = express.Router();
const { getCrowdData, addCrowdData, getPrediction } = require('../controllers/crowdController');

router.get('/:zoneId', getCrowdData);
router.post('/', addCrowdData);
router.get('/:zoneId/prediction', getPrediction);

module.exports = router;
