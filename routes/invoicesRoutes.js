const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoicesController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', invoicesController.getAllInvoices);
router.get('/bar-chart', invoicesController.getBarChartInvoices);
router.get('/line-chart', invoicesController.getLineChartInvoices);
router.put('/:id/update-amount', invoicesController.updateInvoiceAmount);
router.put('/:id/approve', invoicesController.approveInvoice);
router.put('/:id/cancel', invoicesController.cancelInvoice);

module.exports = router;