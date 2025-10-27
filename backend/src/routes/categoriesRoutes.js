const express = require('express');
const categoriesController = require('../controllers/categoriesController');
const { requestLogger } = require('../middlewares/logMiddleware');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', requestLogger, categoriesController.get_all_categories);
router.get('/:category_id', requestLogger, categoriesController.get_category_by_id);
router.get('/:category_id/posts', requestLogger, categoriesController.get_posts_by_category)
router.post('/', authenticate, isAdmin, requestLogger, categoriesController.create_category)
router.patch('/:category_id', authenticate, isAdmin, requestLogger, categoriesController.update_category);
router.delete('/:category_id', authenticate, isAdmin, requestLogger, categoriesController.delete_category)

module.exports = router;