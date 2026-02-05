const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/sync
// @desc    Sync Firebase user with MongoDB
// @access  Protected
router.post('/sync', protect, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      // Update existing user if needed
      user.email = email;
      user.displayName = name || user.displayName;
      user.photoURL = picture || user.photoURL;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        firebaseUid: uid,
        email,
        displayName: name,
        photoURL: picture,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during sync' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Protected
router.get('/me', protect, async (req, res) => {
  try {
    if (!req.mongoUser) {
      return res.status(404).json({ message: 'User profile not found in database. Please sync.' });
    }
    res.json(req.mongoUser);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;