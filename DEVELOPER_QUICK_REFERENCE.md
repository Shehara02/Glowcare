# 🚀 GlowCare Developer Quick Reference

## 📌 Quick Commands

### Start Development Servers

```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev

# Both running:
# Backend: http://localhost:5000
# Frontend: http://localhost:5173
```

### Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Environment Setup

```bash
# Backend - Create .env from example
cd backend
cp .env.example .env
# Edit .env with your values
```

---

## 📁 Essential File Locations

```
Backend Core:
├── server.js                    # Main server entry point
├── middleware/
│   ├── auth.js                  # JWT authentication
│   ├── security.js              # Helmet, rate limiting, sanitization
│   └── errorHandler.js          # Error handling
├── services/
│   ├── paymentService.js        # Stripe integration (READY)
│   └── imageService.js          # Cloudinary integration (READY)
├── utils/
│   └── validators.js            # Input validation
├── routes/                      # API endpoints
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── controllers/                 # Business logic
├── models/                      # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   └── Order.js
└── .env.example                 # Environment template

Frontend Core:
├── src/App.jsx                  # Main app with routing
├── src/context/
│   ├── AuthContext.jsx          # User authentication
│   ├── CartContext.jsx          # Shopping cart
│   ├── ThemeContext.jsx         # Dark/light mode
│   └── NotificationContext.jsx  # Toast notifications
├── src/services/
│   ├── api.js                   # Axios instance with JWT
│   ├── productService.js        # Product API calls
│   └── orderService.js          # Order API calls
├── src/pages/                   # Page components
├── src/components/              # Reusable components
├── src/animations/
│   └── variants.js              # Framer Motion animations
├── src/utils/
│   └── helpers.js               # Utility functions
└── tailwind.config.js           # Tailwind setup
```

---

## 🔐 Security Checklist

### When Creating New Endpoints

```javascript
// ✅ Always do this:

// 1. Add authentication middleware
router.post('/api/orders', authenticateToken, (req, res) => {});

// 2. Validate input
import { validateOrderData } from '../utils/validators.js';
const { isValid, errors } = validateOrderData(req.body);
if (!isValid) return res.status(400).json(errors);

// 3. Use rate limiting
import { apiLimiter } from '../middleware/security.js';
router.use(apiLimiter);

// 4. Handle errors properly
try {
  // code
} catch (error) {
  return res.status(500).json({ error: error.message });
}

// 5. Return sanitized data (never send sensitive info)
res.json({ success: true, data: sanitizedData });
```

---

## 🎨 Component Template

### Creating New Pages

```jsx
// pages/MyPage.jsx
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { NotificationContext } from '@/context/NotificationContext';
import { motion } from 'framer-motion';
import { pageVariants } from '@/animations/variants';

export default function MyPage() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { showSuccess, showError } = useContext(NotificationContext);

  useEffect(() => {
    // Load data on mount
  }, []);

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      <div className="container mx-auto py-10">
        {/* Your content here */}
      </div>
    </motion.div>
  );
}
```

### Creating New Components

```jsx
// components/MyComponent.jsx
import { motion } from 'framer-motion';
import { cardVariants } from '@/animations/variants';

export default function MyComponent({ title, children }) {
  return (
    <motion.div 
      variants={cardVariants}
      whileHover="hover"
      className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </motion.div>
  );
}
```

---

## 🌐 API Call Pattern

### Using the API Service

```javascript
// services/api.js already has JWT interceptor
import api from '@/services/api';

// Making requests:
try {
  const response = await api.get('/api/products');
  const data = await api.post('/api/orders', orderData);
  const updated = await api.put('/api/products/1', updateData);
  await api.delete('/api/products/1');
} catch (error) {
  const errorMsg = error.response?.data?.message || 'Error occurred';
  showError(errorMsg);
}
```

---

## 📊 Using Stripe Service

### Quick Stripe Integration

```javascript
// Backend - Create payment intent
import PaymentService from '@/services/paymentService';

// In checkout controller:
const paymentIntent = await PaymentService.createPaymentIntent(
  orderTotal * 100, // amount in cents
  { orderId, userId } // metadata
);

res.json({ clientSecret: paymentIntent.client_secret });

// Process refund:
const refund = await PaymentService.createRefund(
  paymentIntentId,
  amountInCents
);
```

---

## 🖼️ Using Cloudinary Service

### Quick Image Upload

```javascript
// Backend - Upload image
import ImageService from '@/services/imageService';

// Upload single file:
const result = await ImageService.uploadImage(
  file,
  'products' // folder
);

// Get optimized URL:
const optimized = ImageService.getOptimizedUrl(
  publicId,
  { width: 400, height: 400, quality: 'auto' }
);

// Delete image:
await ImageService.deleteImage(publicId);
```

---

## 🔔 Using Notifications

### Toast Messages

```javascript
import { useContext } from 'react';
import { NotificationContext } from '@/context/NotificationContext';

export default function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = 
    useContext(NotificationContext);

  return (
    <button onClick={() => showSuccess('Action completed!')}>
      Show Success
    </button>
  );
}
```

---

## 🎬 Using Animations

### Framer Motion Integration

```javascript
import { motion } from 'framer-motion';
import { pageVariants, cardVariants, buttonVariants } from '@/animations/variants';

// Page transitions:
<motion.div variants={pageVariants} initial="hidden" animate="visible">

// Card animations:
<motion.div variants={cardVariants} whileHover="hover">

// Button animations:
<motion.button variants={buttonVariants} whileHover="hover" whileTap="tap">

// Container with staggered children:
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 🧪 Testing Stripe

### Test Card Numbers

```
✅ Success: 4242 4242 4242 4242
❌ Decline: 4000 0000 0000 0002
❌ Auth Required: 4000 2000 0000 0000
✅ Visa: 4111 1111 1111 1111

Any future date for expiry
Any 3 digits for CVC
```

---

## 🧪 Testing Authentication

### Demo Credentials

```
Regular User:
Email: john@example.com
Password: password

Admin User:
Email: admin@glowcare.com
Password: Admin@123456
```

---

## 📝 Validation Examples

```javascript
// Validate product
import { validateProductData } from '@/utils/validators';

const productData = {
  name: 'Face Serum',
  description: 'Hydrating serum',
  price: 49.99,
  category: 'serums',
  image: 'url...',
  stock: 10
};

const { isValid, errors } = validateProductData(productData);
if (!isValid) {
  console.log('Validation errors:', errors);
}

// Validate order
import { validateOrderData } from '@/utils/validators';

const { isValid, errors } = validateOrderData(orderData);
```

---

## 🌙 Dark Mode Setup

### Toggle Dark Mode

```javascript
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

---

## 📱 Responsive Breakpoints

### Tailwind Breakpoints

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px

Usage: <div className="md:text-lg lg:text-2xl">
```

---

## 🎨 Color Palette

### Tailwind Config Colors

```
Primary (Pink): #f8b4d6
Secondary (Beige): #f5e6d3
Accent (Green): #10b981

Usage:
className="text-pink-400"
className="bg-green-500"
className="border-yellow-200"
```

---

## 🔗 Routing Pattern

### React Router Setup

```jsx
// In App.jsx:
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<Router>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
    <Route path="/products/:id" element={<ProductDetail />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
    </Route>
    <Route element={<AdminRoute />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Route>
  </Routes>
</Router>
```

---

## 📦 TypeScript Types (If Using)

### User Type

```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  address?: Address[];
  createdAt: Date;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}
```

### Product Type

```typescript
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  skinType: string[];
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: Review[];
  createdAt: Date;
}

interface Review {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
```

---

## 🐛 Debugging Tips

### Check Browser Console
```javascript
// Log current auth state
console.log(user, isAuthenticated);

// Check localStorage
console.log(localStorage.getItem('token'));

// Monitor API calls
// Open DevTools Network tab to see all requests
```

### Check Server Logs
```bash
# Look for errors in terminal where npm run dev is running
# Check for:
- Middleware errors
- Database connection issues
- Rate limiting messages
```

### Common Issues

```
Problem: "Cannot find module"
Solution: Make sure package is installed: npm install package-name

Problem: "JWT expired"
Solution: Clear localStorage and login again

Problem: "CORS error"
Solution: Check FRONTEND_URL in .env matches your frontend URL

Problem: "Database connection failed"
Solution: Check MONGODB_URI in .env is correct

Problem: "Stripe error"
Solution: Verify API keys in .env are correct
```

---

## 🚀 Deployment Commands

### Before Deploying

```bash
# Build frontend
cd frontend
npm run build

# Check for errors
npm run lint

# Test production build
npm run preview
```

### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-backend-url.com
```

### Deploy to Render (Backend)

```bash
# Push to GitHub
git push origin main

# Go to render.com
# Create new Web Service
# Connect GitHub repo
# Add environment variables
# Deploy
```

---

## 📚 Documentation Links

- [Stripe Docs](https://stripe.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [MongoDB](https://docs.mongodb.com/)

---

## ✅ Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] All images loading
- [ ] API endpoints responding
- [ ] Error handling working
- [ ] Notifications displaying
- [ ] Rate limiting active
- [ ] Security headers present
- [ ] Environment variables set
- [ ] Database backed up
- [ ] Monitoring configured

---

## 🎯 Common Code Patterns

### Protected Route Component

```jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

### Admin Route Component

```jsx
export function AdminRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Loading...</div>;
  
  return user?.role === 'admin' ? children : <Navigate to="/" />;
}
```

### Form Error Display

```jsx
export function FormError({ errors, field }) {
  return errors?.[field] ? (
    <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
  ) : null;
}
```

---

## 🎉 Quick Stats

- **Lines of Code:** 2,000+
- **Components:** 15+
- **Pages:** 12+
- **API Endpoints:** 20+
- **Database Models:** 3
- **Security Features:** 8+
- **Documentation Pages:** 5

---

*Last Updated: May 14, 2026*
*Quick Reference v1.0*
*Keep this guide handy while developing! 📌*
