const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

// Get reviews for a property
router.get('/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add review
router.post('/', protect, async (req, res) => {
  try {
    const { property, rating, comment } = req.body;
    const existing = await Review.findOne({ user: req.user._id, property });
    if (existing) return res.status(400).json({ message: 'You already reviewed this property' });
    const review = await Review.create({ user: req.user._id, property, rating, comment });
    // Update property rating
    const reviews = await Review.find({ property });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Property.findByIdAndUpdate(property, { rating: avgRating.toFixed(1), reviewCount: reviews.length });
    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
