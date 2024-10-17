const jwt = require('jsonwebtoken');
module.exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret
        req.user = decoded; // Attach the user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
