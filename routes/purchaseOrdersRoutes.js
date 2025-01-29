// routes/purchaseOrdersRoutes.js
const express = require('express');
const router = express.Router();
const purchaseOrdersController = require('../controllers/purchaseOrdersController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('file') , purchaseOrdersController.createPurchaseOrder);
router.get('/', purchaseOrdersController.getPurchaseOrders);
router.get('/:id', purchaseOrdersController.getPurchaseOrderById);
router.put('/:id/approve', purchaseOrdersController.approvePurchaseOrder);
router.put('/:id/update-amount', purchaseOrdersController.updatePurchaseOrder);
router.put('/:id/cancel', purchaseOrdersController.cancelPurchaseOrder);
router.post('/:id/send-to-provider', purchaseOrdersController.sendFileToProvider);

module.exports = router;