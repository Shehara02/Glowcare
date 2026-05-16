/* ========================================
   GLOWCARE - MERN BACKEND SERVER
   ======================================== */

require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { errorMiddleware } = require('./middleware/errorHandler');
const {
  helmetMiddleware,
  authLimiter,
  apiLimiter,
  mongoSanitizeMiddleware,
  securityHeadersMiddleware,
} = require('./middleware/security');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// ========== SECURITY MIDDLEWARE ==========

// Helmet for security headers
app.use(helmetMiddleware);

// Security headers
app.use(securityHeadersMiddleware);

// Morgan logging
app.use(morgan('combined'));

// ========== MIDDLEWARE ==========

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB sanitization
app.use(mongoSanitizeMiddleware);

// CORS with improved configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// ========== DATABASE CONNECTION ==========

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// ========== API ROUTES ==========

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/orders', apiLimiter, orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ========== ERROR HANDLING ==========

app.use(errorMiddleware);

// ========== START SERVER ==========

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════╗
    ║     GlowCare Backend Server        ║
    ║     Running on port ${PORT}          ║
    ║     Environment: ${process.env.NODE_ENV}  ║
    ╚════════════════════════════════════╝
  `);
});

module.exports = app;
