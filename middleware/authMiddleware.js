const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Get the token from cookies or Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user info from the token payload
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;