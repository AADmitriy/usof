// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

exports.authenticate = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next()
};

exports.isAdmin = (req, res, next) => {
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
};
