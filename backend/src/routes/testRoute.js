const express = require('express');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/users', authenticate, (req, res) => {
    const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
    res.json(users);
});

router.get('/users-admin', authenticate, isAdmin, (req, res) => {
    const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, {id: 3, name: 'Admin'}];
    res.json(users);
});

module.exports = router;