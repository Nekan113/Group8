const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');


router.use(verifyToken, authorize(['ADMIN']));

// Player management
router.get('/players', adminController.getAllPlayers);
router.patch('/status/:id', adminController.toggleStatus);

// Online game room management 
router.get('/games', adminController.getOnlineGames);
router.get('/games/search', adminController.searchOnlineGames);
router.post('/games/:id/close', adminController.closeGameRoom);

module.exports = router;