const express = require('express');
const usersController = require('../controllers/usersController');
const { requestLogger } = require('../middlewares/logMiddleware');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware')

const router = express.Router();

router.get('/', authenticate, isAdmin, requestLogger, usersController.get_all_users);
router.get('/self', authenticate, requestLogger, usersController.get_self);
router.get('/:user_id', authenticate, requestLogger, usersController.get_user_by_id);
router.get('/user_preview_data/:user_id',requestLogger, usersController.user_preview_data )
router.post('/', authenticate, isAdmin, requestLogger, usersController.create_user)
router.patch('/avatar', authenticate, requestLogger, upload.single('file'), usersController.set_avatar)
router.patch('/:user_id', authenticate, requestLogger, usersController.update_user_data);
router.delete('/:user_id', authenticate, isAdmin, requestLogger, usersController.delete_user)

module.exports = router;