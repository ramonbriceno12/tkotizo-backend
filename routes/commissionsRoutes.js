const express = require('express');
const router = express.Router();

const commissionsController = require('../controllers/commissionsController');

router.get('/', commissionsController.getAllCommissions);
router.post('/', commissionsController.createCommission);
// router.get('/:id', commissionsController.getCommissionById);
// router.put('/:id/update-amount', commissionsController.updateCommissionAmount);
// router.put('/:id/approve', commissionsController.approveCommission);
// router.put('/:id/cancel', commissionsController.cancelCommission);

module.exports = router;
