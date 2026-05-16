# GlowCare Deployment Guide

## 🚀 Production Deployment Checklist

### Pre-Deployment (Phase 1: Security & Configuration)

- [ ] **Environment Variables Setup**
  ```bash
  # Copy .env.example to .env
  cp backend/.env.example backend/.env
  # Fill in all production values
  ```

- [ ] **Security Checklist**
  - [ ] Change JWT_SECRET to a strong random value
  - [ ] Change JWT_REFRESH_SECRET to a strong random value
  - [ ] Set NODE_ENV=production
  - [ ] Enable rate limiting in production
  - [ ] Enable sanitization in production
  - [ ] Configure CORS for production domain
  - [ ] Set up HTTPS/SSL certificates

- [ ] **Database Setup**
  - [ ] Create MongoDB Atlas account
  - [ ] Create production database cluster
  - [ ] Create database user with strong password
  - [ ] Whitelist IP addresses
  - [ ] Get connection string
  - [ ] Test connection locally first

- [ ] **Third-Party Services**
  - [ ] Set up Stripe account and get API keys
  - [ ] Set up Cloudinary account and get API credentials
  - [ ] Generate Stripe webhook secret
  - [ ] Configure webhook endpoints
  - [ ] Test payment flow in sandbox mode

---

## 📦 Backend Deployment (Render.com or Railway.app)

### Using Render.com

1. **Connect Repository**
   ```bash
   git push origin main
   # Go to render.com and create new Web Service
   ```

2. **Configure Service**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - Copy all from .env file
     - Add MONGO_DB_URI for production
     - Add FRONTEND_URL as your production domain

3. **Deploy**
   - Connect GitHub repository
   - Render auto-deploys on git push
   - Monitor logs in Render dashboard

4. **Test API**
   ```bash
   curl https://your-api.onrender.com/api/health
   ```

### Using Railway.app

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   railway init
   railway up
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV production
   railway variables set MONGODB_URI your_production_uri
   # ... add all other variables
   ```

---

## 🎨 Frontend Deployment (Vercel.com)

### Setup Vercel

1. **Create Vercel Account**
   - Go to vercel.com
   - Sign up with GitHub

2. **Connect Project**
   ```bash
   cd frontend
   vercel
   # Follow prompts to connect to Vercel
   ```

3. **Configure Environment**
   - Project Settings → Environment Variables
   - Add `VITE_API_URL` pointing to your backend API
   ```
   VITE_API_URL=https://your-api.onrender.com/api
   ```

4. **Deploy**
   ```bash
   vercel --prod
   # Or just push to main branch, Vercel auto-deploys
   ```

5. **Configure Domain**
   - Vercel Settings → Domains
   - Add your custom domain
   - Update DNS records

---

## 🔐 Production Security Hardening

### Backend Security

1. **HTTPS/SSL**
   - Render/Railway provides free SSL
   - Verify certificate is valid

2. **Environment Variables**
   - Never commit .env to Git
   - .env already in .gitignore
   - Use platform secrets instead

3. **Rate Limiting**
   - Auth endpoints: 5 requests per 15 minutes
   - API endpoints: 100 requests per 15 minutes
   - Already configured in server.js

4. **CORS Configuration**
   ```javascript
   // Only allow your frontend domain
   CORS_ORIGIN=https://yourdomain.com
   ```

5. **Helmet.js**
   - Enabled by default
   - Sets security headers
   - Protects against common attacks

6. **MongoDB**
   - Use strong password
   - Whitelist IP only (or use variable)
   - Enable authentication
   - Regular backups

### Frontend Security

1. **CSP Headers**
   - Vercel configures secure headers
   - Validate in browser DevTools

2. **Dependencies**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Build Optimization**
   ```bash
   npm run build
   # Check bundle size
   ```

---

## 📊 Monitoring & Logging

### Backend Monitoring

1. **Render.com Monitoring**
   - Dashboard shows uptime
   - View logs in real-time
   - Set up alerts

2. **Error Tracking**
   - Integrate Sentry (optional)
   ```bash
   npm install @sentry/node
   ```

3. **Performance Monitoring**
   - Monitor response times
   - Track error rates
   - Monitor database performance

### Frontend Monitoring

1. **Vercel Analytics**
   - Built-in performance metrics
   - Core Web Vitals
   - Error tracking

2. **Sentry Integration**
   ```bash
   npm install @sentry/react
   ```

---

## 🧪 Production Testing Checklist

### Before Going Live

- [ ] Test all authentication flows
- [ ] Test product browsing and filtering
- [ ] Test cart functionality
- [ ] Test payment (Stripe test mode)
- [ ] Test order creation
- [ ] Test admin dashboard
- [ ] Test mobile responsiveness
- [ ] Test dark/light mode
- [ ] Test on multiple browsers
- [ ] Performance testing
- [ ] Security audit
- [ ] Database backup testing

### Post-Deployment

- [ ] Monitor logs for errors
- [ ] Check uptime monitoring
- [ ] Monitor error rates
- [ ] Check Core Web Vitals
- [ ] Monitor database performance
- [ ] Check for security alerts

---

## 💾 Database Backup Strategy

### MongoDB Atlas Backup

1. **Enable Automated Backups**
   - MongoDB Atlas → Backup settings
   - Enable daily backups
   - Retention: 7-30 days

2. **Manual Backup**
   ```bash
   mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/glowcare"
   ```

3. **Restore Backup**
   ```bash
   mongorestore dump/
   ```

---

## 📈 Scaling Considerations

### As Traffic Grows

1. **Database Optimization**
   - Add indexes
   - Monitor slow queries
   - Consider read replicas

2. **API Caching**
   - Implement Redis caching
   - Cache frequently accessed data
   - Reduce database load

3. **CDN Setup**
   - Use CloudFlare for frontend
   - Serve images from CDN
   - Faster global content delivery

4. **Load Balancing**
   - Deploy multiple backend instances
   - Use load balancer
   - Horizontal scaling

---

## 🚨 Troubleshooting

### API Not Responding

```bash
# Check API health
curl https://your-api.onrender.com/api/health

# Check logs
# Render.com: Dashboard → Logs
# Railway.app: railway logs

# Check environment variables
# Ensure all required vars are set
```

### Database Connection Issues

```bash
# Test connection string locally
mongo "mongodb+srv://user:pass@cluster.mongodb.net/glowcare"

# Check MongoDB Atlas whitelist
# Ensure Render/Railway IP is whitelisted
```

### Payment Not Working

- [ ] Check Stripe test/live keys
- [ ] Verify webhook endpoint
- [ ] Check CORS origin
- [ ] Review Stripe dashboard

---

## 📞 Support & Maintenance

### Regular Maintenance

- [ ] Weekly: Check error rates
- [ ] Weekly: Monitor performance
- [ ] Monthly: Security updates
- [ ] Monthly: Dependency updates
- [ ] Quarterly: Database optimization

### Dependency Updates

```bash
# Frontend
cd frontend
npm update
npm audit fix

# Backend
cd backend
npm update
npm audit fix
```

---

## 🎯 Final Checklist

Before declaring production-ready:

- [ ] All features working
- [ ] Security audit passed
- [ ] Performance acceptable (< 2s load time)
- [ ] Mobile responsive
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Error tracking configured
- [ ] API documentation updated
- [ ] Team trained on deployment
- [ ] Rollback plan documented

---

## 📚 Useful Links

- **Render.com Docs**: https://render.com/docs
- **Railway.app Docs**: https://railway.app/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Stripe API**: https://stripe.com/docs/api
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

*Last Updated: May 14, 2026*
*Deployment Status: Ready for Production*
