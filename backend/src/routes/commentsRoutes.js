const express = require('express');
const commentsController = require('../controllers/commentsController');
const { requestLogger } = require('../middlewares/logMiddleware');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', requestLogger, commentsController.get_all_comments);
router.get('/:comment_id', requestLogger, commentsController.get_comment_by_id);
router.get('/:comment_id/like', requestLogger, commentsController.get_comment_likes)
router.post('/', authenticate, requestLogger, commentsController.create_comment)
router.post('/:comment_id/like', authenticate, requestLogger, commentsController.create_like)
router.patch('/:comment_id', authenticate, requestLogger, commentsController.update_comment)
router.delete('/:comment_id', authenticate, requestLogger, commentsController.delete_comment)
router.delete('/:comment_id/like', authenticate, requestLogger, commentsController.delete_like)

module.exports = router;