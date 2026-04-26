const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Toggle favorite
router.post('/toggle/:propertyId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const propId = req.params.propertyId;
    const idx = user.favorites.indexOf(propId);
    if (idx === -1) {
      user.favorites.push(propId);
    } else {
      user.favorites.splice(idx, 1);
    }
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get favorites
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
