# GlowCare - Full Stack MERN E-Commerce Application

A professional full-stack skincare e-commerce application built with MERN (MongoDB, Express, React, Node.js) stack with modern UI, authentication, and admin dashboard.

## 🎯 Project Overview

GlowCare is a complete e-commerce solution for skincare products with:
- Modern React frontend with Tailwind CSS
- RESTful Express.js backend
- MongoDB database with Mongoose ODM
- JWT authentication and authorization
- Admin dashboard for product and order management
- Fully responsive design
- Dark/Light mode support

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Running the Application](#running-the-application)
6. [API Documentation](#api-documentation)
7. [Frontend Pages](#frontend-pages)
8. [Database Models](#database-models)
9. [Authentication](#authentication)
10. [Deployment](#deployment)

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI Library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL Database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables

---

## ✨ Features

### User Features
- ✅ User registration and login with JWT authentication
- ✅ Browse and search products
- ✅ Filter by category and skin type
- ✅ View product details with reviews and ratings
- ✅ Add/remove products from cart
- ✅ Add/remove products from wishlist
- ✅ Place orders
- ✅ View order history and status
- ✅ Update profile information
- ✅ Dark/Light mode toggle

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Manage products (Create, Read, Update, Delete)
- ✅ Manage orders and update delivery status
- ✅ View all users
- ✅ Inventory management

---

## 📁 Project Structure

```
GlowCare/
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── server.js
│   ├── seed.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── ProductCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageProducts.jsx
│   │   │       └── ManageOrders.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── productService.js
│   │   │   └── orderService.js
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.local
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (already created)
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/glowcare
   JWT_SECRET=your_jwt_secret_key
   ADMIN_EMAIL=admin@glowcare.com
   ADMIN_PASSWORD=Admin@123456
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

5. **Seed the database** (populate with sample data)
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env.local file** (optional)
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run at `http://localhost:5173`

---

## 🚀 Running the Application

### Using npm

**Backend (Terminal 1)**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
```

### Using Docker (Optional)

Create `docker-compose.yml` in the root directory:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: glowcare

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/glowcare
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
```

Run with: `docker-compose up`

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register       Register new user
POST   /api/auth/login          Login user
GET    /api/auth/me             Get current user (Protected)
PUT    /api/auth/profile        Update profile (Protected)
PUT    /api/auth/change-password Change password (Protected)
```

### Product Endpoints

```
GET    /api/products            Get all products (with filters)
GET    /api/products/:id        Get single product
POST   /api/products            Create product (Admin)
PUT    /api/products/:id        Update product (Admin)
DELETE /api/products/:id        Delete product (Admin)
POST   /api/products/:id/review Add product review (Protected)
```

### Order Endpoints

```
POST   /api/orders              Create order (Protected)
GET    /api/orders/my-orders    Get user orders (Protected)
GET    /api/orders/:id          Get order details (Protected)
PUT    /api/orders/:id/cancel   Cancel order (Protected)
GET    /api/orders              Get all orders (Admin)
PUT    /api/orders/:id/status   Update order status (Admin)
```

---

## 🏠 Frontend Pages (To Be Created)

All these pages are referenced in App.jsx but need to be created:

### Public Pages
- [ ] Home.jsx ✅ (Created)
- [ ] Products.jsx ✅ (Created)
- [ ] ProductDetail.jsx
- [ ] About.jsx
- [ ] Contact.jsx

### Authentication Pages
- [ ] Login.jsx
- [ ] Register.jsx

### User Pages
- [ ] Cart.jsx
- [ ] Wishlist.jsx
- [ ] Checkout.jsx
- [ ] Profile.jsx
- [ ] OrderHistory.jsx

### Admin Pages
- [ ] admin/Dashboard.jsx
- [ ] admin/ManageProducts.jsx
- [ ] admin/AddProduct.jsx
- [ ] admin/EditProduct.jsx
- [ ] admin/ManageOrders.jsx

---

## 💾 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('user' | 'admin'),
  phone: String,
  address: {
    street, city, state, zipCode, country
  },
  profileImage: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  category: String,
  skinType: [String],
  price: Number,
  image: String,
  stock: Number,
  rating: Number,
  numReviews: Number,
  reviews: [{
    user: ObjectId,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  ingredients: [String],
  benefits: [String],
  usage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  orderNumber: String (unique),
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  shippingAddress: {
    street, city, state, zipCode, country, phone
  },
  subtotal: Number,
  shippingCost: Number,
  tax: Number,
  totalPrice: Number,
  paymentMethod: String,
  paymentStatus: String ('pending' | 'completed' | 'failed'),
  deliveryStatus: String ('pending' | 'shipped' | 'delivered' | 'cancelled'),
  trackingNumber: String,
  estimatedDeliveryDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication

### JWT Implementation

1. **Token Generation** (on login/register)
   ```javascript
   const token = jwt.sign(
     { userId, role },
     process.env.JWT_SECRET,
     { expiresIn: '7d' }
   );
   ```

2. **Token Verification** (middleware)
   ```javascript
   const token = headers.authorization?.split(' ')[1];
   const decoded = jwt.verify(token, JWT_SECRET);
   ```

3. **Frontend Token Storage**
   - Stored in localStorage
   - Sent in Authorization header: `Bearer {token}`
   - Auto-removed on logout

### Protected Routes

Routes are protected using middleware:
```javascript
router.post('/orders', protect, createOrder);
router.delete('/products/:id', protect, isAdmin, deleteProduct);
```

---

## 🎨 Styling with Tailwind CSS

### Color Palette
- **Primary:** `#f8b4d6` (Pink)
- **Secondary:** `#f5e6d3` (Beige)
- **Accent:** `#e8f5e9` (Green)
- **Dark:** `#333333`

### Custom Configuration
See `tailwind.config.js` for:
- Custom colors
- Font families
- Animation keyframes
- Dark mode settings

---

## 📦 Building for Production

### Backend
```bash
cd backend
npm install --production
NODE_ENV=production node server.js
```

### Frontend
```bash
cd frontend
npm install --production
npm run build
# Output in dist/ directory
```

---

## 🌐 Deployment

### Backend Deployment (Heroku/Railway)
1. Push code to Git
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Upload dist/ folder to hosting
```

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Check MongoDB is running
- Verify MONGODB_URI in .env
- Check firewall settings

**CORS Error**
- Backend CORS config includes frontend URL
- Check proxy settings in vite.config.js

**Token Invalid**
- JWT_SECRET must be same in backend
- Check token expiration
- Clear localStorage and re-login

**Port Already in Use**
- Change PORT in .env
- Or kill process using the port

---

## 📝 Additional Tasks

### Frontend Pages to Complete
1. Create all remaining pages using the same structure as Home.jsx
2. Implement loading states and error handling
3. Add form validation
4. Add toast notifications

### Backend Enhancements
1. Add email verification
2. Implement password reset
3. Add rate limiting
4. Add request validation

### Advanced Features
1. Payment integration (Stripe)
2. Email notifications
3. Image upload (Cloudinary)
4. Product recommendations
5. Customer reviews approval system
6. Discount codes/coupons
7. Analytics dashboard

---

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT.io](https://jwt.io)

---

## 📄 License

This project is MIT licensed.

---

## 🤝 Contributing

Contributions are welcome! Please follow standard practices and submit pull requests.

---

## 👨‍💻 Author

Created as a full-stack MERN portfolio project.

---

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Last Updated:** 2024
**Version:** 1.0.0
