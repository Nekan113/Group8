const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.post('/', gameController.createGame);
router.get('/history', gameController.getGameHistory);
router.get('/:id/replay', gameController.getReplay);   
router.get('/:id', gameController.getGame);
router.post('/:id/move', gameController.makeMove);
router.post('/:id/abort', gameController.abortGame);

module.exports = router;
