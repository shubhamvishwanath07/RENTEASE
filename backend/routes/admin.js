const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [users, properties, bookings, pendingProperties] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments({ isApproved: true }),
      Booking.countDocuments(),
      Property.countDocuments({ isApproved: false })
    ]);
    res.json({ users, properties, bookings, pendingProperties });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all properties (pending)
router.get('/properties', protect, adminOnly, async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve property
router.put('/properties/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const { isApproved, isFeatured } = req.body;
    const property = await Property.findByIdAndUpdate(req.params.id, { isApproved, isFeatured }, { new: true });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete property
router.delete('/properties/:id', protect, adminOnly, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
