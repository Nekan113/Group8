const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');


router.use(verifyToken, authorize(['ADMIN']));


router.get('/players', adminController.getAllPlayers);

router.patch('/status/:id', adminController.toggleStatus);

module.exports = router;