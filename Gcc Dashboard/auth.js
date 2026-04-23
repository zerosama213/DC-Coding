// Authentication middleware and utilities
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Hash password
function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

// Verify password
function verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.userId = decoded.userId;
    next();
}

module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    verifyPassword,
    authenticateToken,
};
