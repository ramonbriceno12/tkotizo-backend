// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.put('/:id/deactivate', userController.deactivateUser);
router.put('/:id/activate', userController.activateUser);

module.exports = router;
