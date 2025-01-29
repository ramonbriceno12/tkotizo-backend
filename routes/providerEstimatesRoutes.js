const express = require('express');
const router = express.Router();
const providerEstimatesController = require('../controllers/providerEstimatesController');

router.get('/', providerEstimatesController.getAllProviderEstimates);
router.get('/provider/:id', providerEstimatesController.getProviderEstimatesByProviderId);

module.exports = router;