const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  rent: { type: Number, required: true },
  bhkType: { type: String, enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Studio'], required: true },
  furnished: { type: String, enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'], required: true },
  description: { type: String, required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  area: { type: Number, default: 0 },
  deposit: { type: Number, default: 0 },
  availableFrom: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
