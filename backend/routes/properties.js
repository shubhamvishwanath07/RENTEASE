const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Property = require('../models/Property');
const { protect, ownerOnly } = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get all approved properties with filters
router.get('/', async (req, res) => {
  try {
    const { city, bhkType, furnished, minRent, maxRent, search, featured } = req.query;
    const query = { isApproved: true };
    if (city) query.city = new RegExp(city, 'i');
    if (bhkType) query.bhkType = bhkType;
    if (furnished) query.furnished = furnished;
    if (featured === 'true') query.isFeatured = true;
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') }
      ];
    }
    const properties = await Property.find(query).populate('owner', 'name email phone').sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    ).populate('owner', 'name email phone');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create property (owner)
router.post('/', protect, ownerOnly, upload.array('images', 10), async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
    const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];
    const property = await Property.create({
      ...req.body,
      amenities,
      images,
      owner: req.user._id,
      isApproved: false
    });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update property (owner)
router.put('/:id', protect, ownerOnly, upload.array('images', 10), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const newImages = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : property.images;
    const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : property.amenities;
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body, amenities, images: [...existingImages, ...newImages], isApproved: false },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete property
router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await property.deleteOne();
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Owner's properties
router.get('/owner/my-listings', protect, ownerOnly, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
