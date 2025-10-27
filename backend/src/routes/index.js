const express = require('express');
const testRoute = require('./testRoute');
const authRoutes = require('./authRoutes');
const usersRoutes = require('./usersRoutes');
const postsRoutes = require('./postsRoutes')
const categoriesRoutes = require('./categoriesRoutes')
const commentsRoutes = require('./commentsRoutes')


const router = express.Router();

router.use('/test', testRoute);
router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/posts', postsRoutes)
router.use('/categories', categoriesRoutes)
router.use('/comments', commentsRoutes)

module.exports = router;