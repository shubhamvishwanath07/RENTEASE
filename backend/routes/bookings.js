const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, ownerOnly } = require('../middleware/auth');

// Create booking inquiry
router.post('/', protect, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user._id });
    await booking.populate('property', 'title location rent');
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'title location rent images city')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get owner's inquiries
router.get('/owner-inquiries', protect, ownerOnly, async (req, res) => {
  try {
    const properties = await require('../models/Property').find({ owner: req.user._id });
    const propertyIds = properties.map(p => p._id);
    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property', 'title location rent')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status (owner)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, ownerResponse } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status, ownerResponse }, { new: true }
    ).populate('property user');
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking (user)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
