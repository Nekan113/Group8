const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken} = require('../middleware/auth.middleware');
const {registerValidator, updatePasswordValidator} = require('../middleware/validator.middleware');

router.post('/register', registerValidator, authController.register);
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);






module.exports = router;