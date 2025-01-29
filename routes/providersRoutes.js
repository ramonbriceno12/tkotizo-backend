const express = require('express');
const router = express.Router();
const providersController = require('../controllers/providersController');

router.get('/', providersController.getAllProviders);
router.post('/', providersController.createProvider);
router.get('/:id', providersController.getProviderById);

module.exports = router;