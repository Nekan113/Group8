const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');
const {registerValidator, updatePasswordValidator} = require('../middleware/validator.middleware');

router.post('/register', registerValidator, authController.register);

router.post('/login', authController.login);
router.patch('/update-password', verifyToken, updatePasswordValidator, authController.updatePassword);


router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);

router.get('/admin', verifyToken, authorize(['ADMIN']), authController.getAllPlayers);


module.exports = router;