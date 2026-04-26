require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rentease';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Property.deleteMany(), Booking.deleteMany(), Review.deleteMany()]);
  console.log('Cleared existing data');

  // Create users
  const hashedPw = await bcrypt.hash('password123', 10);

  const admin = await User.create({ name: 'Admin User', email: 'admin@rentease.com', password: hashedPw, role: 'admin', phone: '9000000001' });
  const owner1 = await User.create({ name: 'Rajesh Kumar', email: 'rajesh@rentease.com', password: hashedPw, role: 'owner', phone: '9000000002' });
  const owner2 = await User.create({ name: 'Priya Sharma', email: 'priya@rentease.com', password: hashedPw, role: 'owner', phone: '9000000003' });
  const tenant1 = await User.create({ name: 'Amit Patel', email: 'amit@rentease.com', password: hashedPw, role: 'tenant', phone: '9000000004' });
  const tenant2 = await User.create({ name: 'Neha Singh', email: 'neha@rentease.com', password: hashedPw, role: 'tenant', phone: '9000000005' });

  console.log('Users created');

  // Properties
  const properties = await Property.insertMany([
    {
      title: 'Modern 2BHK in Satellite', location: 'Satellite, Ahmedabad', city: 'Ahmedabad',
      address: '123, Sunrise Apartments, Satellite Road', rent: 18000, bhkType: '2BHK',
      furnished: 'Furnished', description: 'Beautiful 2BHK flat with modern interior, great ventilation and 24/7 security. Near SG highway.',
      amenities: ['WiFi', 'Parking', 'Security', 'Gym', 'Power Backup'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      area: 950, deposit: 54000, owner: owner1._id, isApproved: true, isFeatured: true, rating: 4.5, reviewCount: 2
    },
    {
      title: 'Spacious 3BHK in Bandra West', location: 'Bandra West, Mumbai', city: 'Mumbai',
      address: '45, Sea View Towers, Bandra West', rent: 65000, bhkType: '3BHK',
      furnished: 'Semi-Furnished', description: 'Premium 3BHK with sea view, modular kitchen and premium amenities. Close to shopping malls and restaurants.',
      amenities: ['Sea View', 'Parking', 'Security', 'Lift', 'Swimming Pool'],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
      area: 1600, deposit: 195000, owner: owner1._id, isApproved: true, isFeatured: true, rating: 4.8, reviewCount: 3
    },
    {
      title: 'Cozy 1BHK in Koramangala', location: 'Koramangala, Bangalore', city: 'Bangalore',
      address: '7th Block, Koramangala, Bangalore', rent: 22000, bhkType: '1BHK',
      furnished: 'Furnished', description: 'Compact and well-furnished 1BHK perfect for young professionals. Walking distance from IT parks and cafes.',
      amenities: ['WiFi', 'AC', 'Washing Machine', 'Security'],
      images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 'https://images.unsplash.com/photo-1585128792020-803d29415281?w=800'],
      area: 550, deposit: 66000, owner: owner2._id, isApproved: true, isFeatured: false, rating: 4.2, reviewCount: 1
    },
    {
      title: 'Luxury 3BHK in Gurgaon', location: 'DLF Phase 3, Gurgaon', city: 'Gurgaon',
      address: 'DLF Magnolias, Phase 3, Gurgaon', rent: 80000, bhkType: '3BHK',
      furnished: 'Furnished', description: 'Ultra-luxury apartment in DLF Magnolias with world-class amenities, concierge and club house.',
      amenities: ['Club House', 'Swimming Pool', 'Gym', 'Concierge', 'Valet Parking', 'Tennis Court'],
      images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
      area: 2200, deposit: 240000, owner: owner2._id, isApproved: true, isFeatured: true, rating: 4.9, reviewCount: 4
    },
    {
      title: 'Affordable 1BHK in Powai', location: 'Powai, Mumbai', city: 'Mumbai',
      address: 'Hiranandani Gardens, Powai, Mumbai', rent: 28000, bhkType: '1BHK',
      furnished: 'Semi-Furnished', description: 'Well-located 1BHK near Powai lake. Great connectivity to Andheri and BKC.',
      amenities: ['Parking', 'Security', 'Lift', 'Power Backup'],
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      area: 620, deposit: 84000, owner: owner1._id, isApproved: true, isFeatured: false, rating: 4.0, reviewCount: 2
    },
    {
      title: '2BHK in HSR Layout', location: 'HSR Layout, Bangalore', city: 'Bangalore',
      address: 'Sector 4, HSR Layout, Bangalore', rent: 32000, bhkType: '2BHK',
      furnished: 'Unfurnished', description: 'Spacious unfurnished 2BHK in the heart of HSR Layout. Perfect for families. Pet friendly.',
      amenities: ['Parking', 'Garden', 'Security', 'Power Backup'],
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
      area: 1100, deposit: 96000, owner: owner2._id, isApproved: true, isFeatured: false, rating: 4.3, reviewCount: 1
    },
    {
      title: 'Studio Flat in Andheri East', location: 'Andheri East, Mumbai', city: 'Mumbai',
      address: 'Chakala, Andheri East, Mumbai', rent: 18000, bhkType: 'Studio',
      furnished: 'Furnished', description: 'Compact studio apartment ideal for working professionals. 5 min from metro station.',
      amenities: ['WiFi', 'AC', 'Security', 'Lift'],
      images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
      area: 380, deposit: 54000, owner: owner1._id, isApproved: true, isFeatured: false, rating: 3.9, reviewCount: 1
    },
    {
      title: 'Premium 4BHK Villa in Whitefield', location: 'Whitefield, Bangalore', city: 'Bangalore',
      address: 'EPIP Zone, Whitefield, Bangalore', rent: 75000, bhkType: '4BHK',
      furnished: 'Furnished', description: 'Independent villa with garden, private parking and premium fittings. Best for large families.',
      amenities: ['Private Garden', 'Private Parking', 'Servant Quarter', 'Security', 'Gym', 'Solar Power'],
      images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'],
      area: 3000, deposit: 225000, owner: owner2._id, isApproved: true, isFeatured: true, rating: 5.0, reviewCount: 2
    },
    {
      title: 'Pending 2BHK in Delhi', location: 'Dwarka, Delhi', city: 'Delhi',
      address: 'Sector 12, Dwarka, Delhi', rent: 25000, bhkType: '2BHK',
      furnished: 'Semi-Furnished', description: 'New listing awaiting admin approval.',
      amenities: ['Parking', 'Security'],
      images: [], area: 900, deposit: 75000, owner: owner2._id, isApproved: false, isFeatured: false
    }
  ]);

  console.log('Properties created');

  // Bookings
  await Booking.insertMany([
    { user: tenant1._id, property: properties[0]._id, visitDate: new Date('2024-08-15'), message: 'I am interested in this property. Please confirm.', phone: '9876543210', status: 'confirmed' },
    { user: tenant2._id, property: properties[1]._id, visitDate: new Date('2024-08-20'), message: 'Can I visit on weekends?', phone: '9876543211', status: 'pending' },
    { user: tenant1._id, property: properties[3]._id, visitDate: new Date('2024-08-18'), message: 'Looking for immediate move-in.', phone: '9876543210', status: 'rejected' }
  ]);

  // Reviews
  await Review.insertMany([
    { user: tenant1._id, property: properties[0]._id, rating: 5, comment: 'Amazing property! Very well maintained and owner is cooperative.' },
    { user: tenant2._id, property: properties[0]._id, rating: 4, comment: 'Good location and facilities. Slightly pricey but worth it.' },
    { user: tenant1._id, property: properties[1]._id, rating: 5, comment: 'Sea view is stunning! Premium experience.' }
  ]);

  console.log('Seed data created successfully!');
  console.log('\n--- LOGIN CREDENTIALS ---');
  console.log('Admin:  admin@rentease.com  / password123');
  console.log('Owner1: rajesh@rentease.com / password123');
  console.log('Owner2: priya@rentease.com  / password123');
  console.log('Tenant: amit@rentease.com   / password123');
  console.log('Tenant: neha@rentease.com   / password123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
