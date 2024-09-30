const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token correctly

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: `Failed to authenticate token: ${err.message}` });
        }

        req.user = {
            id: decoded.userId,
            role: decoded.role,
            email:decoded.email

        };
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'SELLER') {
        return res.status(403).json({ message: `Access denied. Sellers only. Your role is: ${req.user.role}` }); // Use req.user.role
    }
    next();
};

const isUser = (req, res, next) => {
    if (req.user.role !== 'USER' && req.user.role !== 'SELLER') {
        return res.status(403).json({ message: 'Access denied. Users only.' });
    }
    next();
};

module.exports = { verifyToken, isAdmin, isUser };
