
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // If no token is provided, return an error response
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                // If the token is invalid, return an error response
                return res.status(401).json({ error: 'Invalid token' });
            }
            
            // If the token is valid, extract the userId from the decoded token
            const userId = decoded.user.Id;

            // Check if the user exists in the database
            const user = await User.findById(User.Id);
            if (!user) {
                // If the user does not exist, return an error response
                return res.status(401).json({ error: 'User not found' });
            }

            // Attach the userId to the request object for use in subsequent route handlers
            req.user.Id = userId;
            next(); // Call the next middleware or route handler
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authenticate;
