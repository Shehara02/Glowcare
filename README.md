# 🌟 GlowCare - Premium Skincare Website

A modern, responsive, and elegant skincare website built with vanilla HTML, CSS, and JavaScript. Perfect for beginners and expandable for e-commerce functionality.

## 📁 Project Structure

```text
GlowCare/
├── assets/             # Folder for images and media files
├── index.html          # Main HTML file with all website content
├── style.css           # Complete styling with responsive design
├── script.js           # Vanilla JavaScript for interactivity
└── README.md           # This file
```

## 🛠️ Tech Stack & Design

### Color Palette (Soft Pastels)
* **Primary Pink:** `#f8b4d6` - Main brand color
* **Secondary Beige:** `#f5e6d3` - Accent color
* **Soft Green:** `#e8f5e9` - Feature highlights
* **Dark Gray:** `#333333` - Text color
* **White:** `#ffffff` - Background

### Typography
* **Headings:** Playfair Display (elegant serif)
* **Body:** Poppins (modern sans-serif)

## 🚀 Features Included

### 1. Navigation Bar
* Sticky header with logo
* Responsive hamburger menu for mobile
* Smooth scroll links to sections
* Hover underline effect on menu items

### 2. Hero Section
* Large product image with floating animation
* Gradient background
* Call-to-action buttons (Shop Now, Learn More)
* Responsive grid layout

### 3. Featured Products Section
* 4 product cards with images
* Product information (name, description, price)
* Add to Cart buttons with click feedback
* Hover animation effects
* Responsive grid (1-4 columns based on screen size)

### 4. Why Choose Us Section
* 3 feature cards (Natural Ingredients, Dermatologist Approved, Cruelty Free)
* Icons for visual interest
* Hover effects with smooth transitions

### 5. Customer Reviews Section
* 3 testimonial cards with star ratings
* Customer images and names
* Responsive layout

### 6. Newsletter Section
* Email subscription form
* Input validation
* Success/error messages
* Clean modern design

### 7. Footer
* Social media icons
* Quick navigation links
* Contact information
* Copyright notice
* Footer links (Privacy, Terms, Cookies)

## 📱 Responsive Breakpoints

* **Mobile:** Below 480px
* **Tablet:** 480px - 768px
* **Desktop:** 768px - 1200px
* **Large Desktop:** 1200px+

The website is fully responsive and works smoothly on all devices.

## ⚙️ JavaScript Features

### 1. Mobile Menu Toggle
* Hamburger menu opens/closes on click
* Menu closes when a link is clicked
* Menu closes when clicking outside

### 2. Smooth Scrolling
* All anchor links scroll smoothly
* "Shop Now" links directly to Products section
* "Learn More" links directly to Why Choose Us section

### 3. Scroll Animations
* Products, features, and reviews fade in as you scroll
* Uses native Intersection Observer API
* No external animation libraries required

### 4. Newsletter Form
* Live email validation
* Dynamic success/error messages
* Automatic form reset upon submission

### 5. Add to Cart
* Displays instant notification when product is added
* Button animation feedback loop

### 6. Scroll-to-Top Button
* Appears dynamically when scrolling down
* Smooth scroll animation back to top

### 7. Keyboard Accessibility
* Interactive buttons respond to Enter and Space keys
* Full keyboard tab navigation support

## 🛠️ How to Use

### Getting Started

#### 1. Open in Browser
* Open `index.html` directly in any standard web browser
* Works natively with local file protocol (`file://`)
* For best experience, use a local development server

#### 2. Using a Local Server (Recommended)

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js http-server
npx http-server
```

Then visit your local browser port at: `http://localhost:8000`

### File Breakdown

* **index.html:** Contains all website content organized in semantic HTML elements (`<nav>`, `<section>`, `<footer>`)
* **style.css:** Complete styling structured with CSS Variables, native animations, and a mobile-first responsive approach
* **script.js:** Core Vanilla JavaScript managing event listeners, form validation, and Intersection Observers

## 🎯 How to Customize

### Change Colors

Open `style.css` and modify the CSS variables at the top of the root directory:

```css
:root {
    --color-primary: #f8b4d6;      /* Change this pink color */
    --color-secondary: #f5e6d3;    /* Change this beige color */
    --color-accent: #e8f5e9;       /* Change this green color */
}
```

### Add Your Own Images

1. Place your target media files in the local `assets/` folder
2. Replace image source strings inside `index.html`:

```html
<!-- Change from external URL -->
<img src="https://images.unsplash.com/photo-..." alt="Product">

<!-- To local folder file path -->
<img src="assets/your-image.jpg" alt="Product">
```

### Add More Products

Copy a product card block inside `index.html` and update the nested text metadata:

```html
<div class="product-card">
    <div class="product-image">
        <img src="assets/product-name.jpg" alt="Product Name">
    </div>
    <div class="product-info">
        <h3 class="product-name">Product Name</h3>
        <p class="product-description">Description text goes here</p>
        <p class="product-price">\$XX.00</p>
        <button class="btn btn-add-cart">Add to Cart</button>
    </div>
</div>
```

### Modify Text & Fonts

* **Brand Name:** Find `✨ GlowCare` in `index.html` and swap it with your brand name
* **Fonts:** Modify the Google Fonts import link inside the `<head>` tag of `index.html` and update your `--font-primary` and `--font-heading` CSS variables in `style.css`

## 📋 Browser Support & Accessibility

* ✅ Chrome, Firefox, Safari, and Edge (Latest Versions)
* ✅ Mobile Browsers (iOS Safari, Android Chrome)
* ♿ Semantic HTML structure with image explicit `alt` text
* ♿ Strict color contrast compliance and responsive text scaling

## 🚀 Future Expansion Ideas

### E-Commerce Functionality
* Dynamic local-storage shopping cart system
* Interactive product filtering and search bar
* User authentication and profile login portals
* Stripe or PayPal sandbox gateway integrations

### Advanced Features
* Image lazy-loading for faster execution speeds
* CSS/JS minification scripts
* Service Worker assets for completely offline PWA support

## 🔧 Troubleshooting

* **Images Not Loading:** Verify your relative file paths match the casing in your `assets/` directory
* **Mobile Menu Inactive:** Ensure JavaScript execution is allowed in your browser settings and check console logs (`F12`)
* **Animations Failing:** Verify your web browser version fully supports the `IntersectionObserver` API

## 📄 License

This project is licensed under the MIT License - free to use and modify for both personal and commercial purposes.
