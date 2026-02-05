const admin = require('../config/firebase-config');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decodedToken = await admin.auth().verifyIdToken(token);

            let user = await User.findOne({ firebaseUid: decodedToken.uid });

            // If user doesn't exist in our DB yet, we can't fully "protect" but 
            // in most cases, we should have a sync step.
            // For now, we attach the firebase user info.
            req.user = decodedToken;
            req.mongoUser = user;

            next();
            return;
        } catch (error) {
            console.error('Auth Middleware Error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
