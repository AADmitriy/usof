const express = require('express');
const authController = require('../controllers/authController');
const { requestLogger } = require('../middlewares/logMiddleware');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', requestLogger, authController.register);
router.post('/login', requestLogger, authController.login);
router.post('/logout', authenticate, requestLogger, authController.logout)
router.get('/confirm-email', requestLogger, authController.confirm_email)
router.post('/resend_confirm_email', requestLogger, authController.resend_confirm_email)
router.post('/password-reset', authenticate, requestLogger, authController.password_reset_send_link)
router.post('/password-reset/:confirm_token', authenticate, requestLogger, authController.set_new_password)

module.exports = router;