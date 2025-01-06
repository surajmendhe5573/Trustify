const jwt= require('jsonwebtoken');
const User= require('../models/user.model');
require('dotenv').config();

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', ''); 
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded.id); // Find user by ID from the token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Attach user data to the request object
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;