const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return secret;
};

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }
    if (decoded.role && decoded.role !== req.user.role) {
      return res.status(401).json({ success: false, message: 'Token role mismatch' });
    }
    next();
  } catch (err) {
    if (err.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ success: false, message: 'Server auth configuration error' });
    }
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access restricted to ${roles.join(', ')} roles.` });
    }
    next();
  };
};
