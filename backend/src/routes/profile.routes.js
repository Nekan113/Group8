const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { updateProfileValidator, changePasswordValidator } = require('../middleware/validator.middleware');
const { upload, processAvatar } = require('../middleware/upload.middleware');

router.use(verifyToken);

router.get('/', profileController.getProfile);
router.put('/', updateProfileValidator, profileController.updateProfile);
router.put('/password', changePasswordValidator, profileController.changePassword);
router.post('/avatar', upload.single('avatar'), processAvatar, profileController.uploadAvatar);
router.get('/history', profileController.getGameHistory);
router.post('/wallet/deposit', profileController.deposit);
router.post('/subscription', profileController.subscribe);

module.exports = router;
