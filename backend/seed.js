require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const PRODUCTS = [
  {
    name: 'Vitamin C Brightening Serum',
    description: 'A potent antioxidant serum that visibly brightens skin tone, fades dark spots, and boosts collagen production for a radiant, youthful complexion.',
    category: 'serum', skinType: ['all'], price: 45.99, stock: 50,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    ingredients: ['Ascorbic Acid 15%', 'Hyaluronic Acid', 'Vitamin E', 'Ferulic Acid', 'Niacinamide'],
    usage: 'Apply 3-4 drops to cleansed face and neck every morning. Follow with moisturizer and SPF.',
    rating: 4.8, numReviews: 124, isBestSeller: true,
  },
  {
    name: 'Rose Hydra Radiance Mask',
    description: 'A luxurious overnight mask infused with Bulgarian rose extract and ceramides to deeply hydrate, plump and restore your skin\'s natural glow.',
    category: 'mask', skinType: ['dry', 'sensitive'], price: 32.99, stock: 35,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
    ingredients: ['Bulgarian Rose Extract', 'Ceramide NP', 'Shea Butter', 'Glycerin', 'Aloe Vera'],
    usage: 'Apply a generous layer to cleansed skin 2-3 times per week. Leave on for 20 minutes or overnight.',
    rating: 4.9, numReviews: 87, isBestSeller: true,
  },
  {
    name: 'Gentle Foaming Cleanser',
    description: 'A pH-balanced foaming cleanser that thoroughly removes makeup, excess oil and impurities without stripping the skin\'s natural moisture barrier.',
    category: 'cleanser', skinType: ['oily', 'all'], price: 24.99, stock: 80,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
    ingredients: ['Gluconoylbetaine', 'Panthenol', 'Aloe Vera', 'Green Tea Extract', 'Salicylic Acid 0.5%'],
    usage: 'Apply to dampened skin and massage gently for 60 seconds. Rinse with lukewarm water. Use morning and evening.',
    rating: 4.6, numReviews: 93, isBestSeller: false,
  },
  {
    name: 'Niacinamide 10% Pore Serum',
    description: 'A multi-benefit serum that minimizes pores, regulates oil production, and visibly reduces redness and uneven skin tone.',
    category: 'serum', skinType: ['oily', 'all'], price: 38.50, stock: 45,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    ingredients: ['Niacinamide 10%', 'Zinc PCA 1%', 'Hyaluronic Acid', 'Panthenol', 'Centella Asiatica'],
    usage: 'Apply 3-4 drops after cleansing. Can be used morning and/or evening. Layer under moisturizer.',
    rating: 4.7, numReviews: 156, isBestSeller: true,
  },
  {
    name: 'Deep Moisture Barrier Cream',
    description: 'An ultra-rich moisturizer packed with ceramides and peptides to repair the skin barrier and lock in moisture for 72 hours of hydration.',
    category: 'moisturizer', skinType: ['dry', 'sensitive'], price: 49.99, stock: 60,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
    ingredients: ['Ceramide Complex', 'Peptide Blend', 'Squalane', 'Hyaluronic Acid', 'Shea Butter'],
    usage: 'Apply a pea-sized amount to face and neck morning and evening on clean skin.',
    rating: 4.8, numReviews: 72, isBestSeller: false,
  },
  {
    name: 'SPF 50+ Daily Sun Shield',
    description: 'A lightweight, non-greasy broad-spectrum sunscreen that protects against UVA and UVB rays while hydrating skin with antioxidants.',
    category: 'sunscreen', skinType: ['all'], price: 29.99, stock: 70,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
    ingredients: ['Zinc Oxide 12%', 'Titanium Dioxide 5%', 'Vitamin E', 'Green Tea Extract', 'Hyaluronic Acid'],
    usage: 'Apply liberally 15 minutes before sun exposure. Reapply every 2 hours or after swimming/sweating.',
    rating: 4.5, numReviews: 108, isBestSeller: true,
  },
  {
    name: 'Calming Centella Toner',
    description: 'A soothing alcohol-free toner enriched with Centella Asiatica to reduce redness, calm irritation, and prep skin for serums.',
    category: 'other', skinType: ['sensitive', 'dry'], price: 22.99, stock: 55,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    ingredients: ['Centella Asiatica 70%', 'Madecassoside', 'Beta-Glucan', 'Panthenol', 'Allantoin'],
    usage: 'Apply with cotton pad or hands after cleansing, morning and evening.',
    rating: 4.6, numReviews: 64, isBestSeller: false,
  },
  {
    name: 'Retinol Renewal Night Cream',
    description: 'A gentle yet effective retinol night cream that stimulates cell turnover, reduces fine lines and leaves skin visibly smoother by morning.',
    category: 'moisturizer', skinType: ['all'], price: 55.99, stock: 30,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
    ingredients: ['Retinol 0.3%', 'Bakuchiol', 'Peptides', 'Ceramides', 'Squalane'],
    usage: 'Apply a pea-sized amount to clean, dry skin 2-3 nights per week. Gradually increase to nightly use.',
    rating: 4.7, numReviews: 91, isBestSeller: true,
  },
  {
    name: 'AHA/BHA Exfoliating Cleanser',
    description: 'A dual-action exfoliating cleanser combining AHA and BHA acids to gently resurface skin, unclog pores and reveal a smoother complexion.',
    category: 'cleanser', skinType: ['oily', 'all'], price: 27.99, stock: 42,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
    ingredients: ['Glycolic Acid 5%', 'Salicylic Acid 2%', 'Lactic Acid', 'Tea Tree Oil', 'Aloe Vera'],
    usage: 'Use 2-3 times per week. Apply to dampened skin, massage gently, then rinse. Avoid contact with eyes.',
    rating: 4.4, numReviews: 47, isBestSeller: false,
  },
  {
    name: 'Hyaluronic Plumping Serum',
    description: 'A multi-molecular hyaluronic acid serum that provides deep and surface hydration, instantly plumping skin and reducing the appearance of fine lines.',
    category: 'serum', skinType: ['all'], price: 42.00, stock: 65,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    ingredients: ['Hyaluronic Acid (3 molecular weights)', 'Vitamin B5', 'Glycerin', 'Aloe Vera', 'Sea Kelp'],
    usage: 'Apply to slightly damp skin morning and evening. Layer under moisturizer for best results.',
    rating: 4.9, numReviews: 203, isBestSeller: true,
  },
  {
    name: 'Charcoal Detox Clay Mask',
    description: 'A deep-cleansing clay mask with activated charcoal and kaolin to draw out impurities, tighten pores and leave skin visibly clearer.',
    category: 'mask', skinType: ['oily', 'all'], price: 26.99, stock: 38,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
    ingredients: ['Activated Charcoal', 'Kaolin Clay', 'Tea Tree Oil', 'Bentonite', 'Witch Hazel'],
    usage: 'Apply a thin layer to face, avoiding eye area. Leave for 10-15 minutes. Rinse with warm water. Use 1-2 times per week.',
    rating: 4.5, numReviews: 78, isBestSeller: false,
  },
  {
    name: 'Waterlight Oil-Free Moisturizer',
    description: 'An ultra-lightweight, oil-free gel moisturizer that provides 24-hour hydration without clogging pores — perfect for oily and acne-prone skin.',
    category: 'moisturizer', skinType: ['oily', 'all'], price: 34.99, stock: 52,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
    ingredients: ['Hyaluronic Acid', 'Niacinamide', 'Green Tea Extract', 'Salicylic Acid 0.5%', 'Zinc PCA'],
    usage: 'Apply morning and evening after serum. Can be worn alone or under SPF.',
    rating: 4.6, numReviews: 89, isBestSeller: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin
    const adminPassword = await bcrypt.hash('Admin@123456', 12);
    await User.create({
      name: 'GlowCare Admin',
      email: 'admin@glowcare.com',
      password: adminPassword,
      role: 'admin',
      passwordConfirm: undefined,
    });
    console.log('👑 Admin user created: admin@glowcare.com / Admin@123456');

    // Create demo user
    const userPassword = await bcrypt.hash('User@123456', 12);
    await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: userPassword,
      role: 'user',
      passwordConfirm: undefined,
    });
    console.log('👤 Demo user created: jane@example.com / User@123456');

    // Insert products
    await Product.insertMany(PRODUCTS);
    console.log(`🌸 Seeded ${PRODUCTS.length} products`);

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
