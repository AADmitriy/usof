const express = require('express');
const postController = require('../controllers/postController');
const { requestLogger } = require('../middlewares/logMiddleware');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware')

const router = express.Router();

router.get('/', requestLogger, postController.get_all_posts);
router.get('/:post_id', requestLogger, postController.get_post_by_id);
router.get('/:post_id/comments', requestLogger, postController.get_post_comments)
router.get('/:post_id/like', requestLogger, postController.get_post_likes)
router.get('/:post_id/categories', requestLogger, postController.get_post_categories)
router.post('/', authenticate, requestLogger, postController.create_post)
router.post('/:post_id/like', authenticate, requestLogger, postController.create_like)
// comment creation is in comments routes
router.patch('/:post_id', authenticate, requestLogger, postController.update_post)
router.delete('/:post_id', authenticate, requestLogger, postController.delete_post)
router.delete('/:post_id/like', authenticate, requestLogger, postController.delete_like)

module.exports = router;