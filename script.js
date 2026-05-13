/* ========================================
   GLOWCARE - JAVASCRIPT
   ======================================== */

/* ========== HAMBURGER MENU FUNCTIONALITY ========== */

// Get hamburger menu and nav menu elements
const hamburgerMenu = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Toggle hamburger menu when clicked
hamburgerMenu.addEventListener('click', function() {
    hamburgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a navigation link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        hamburgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside of it
document.addEventListener('click', function(event) {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburgerMenu.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
        hamburgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

/* ========== SCROLL ANIMATIONS ========== */

// Create Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all product cards, feature cards, and review cards
const animatedElements = document.querySelectorAll(
    '.product-card, .feature-card, .review-card, .section-header'
);
animatedElements.forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

/* ========== SMOOTH SCROLLING ========== */

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ========== BUTTON INTERACTIONS ========== */

// Add to Cart button functionality
const addToCartButtons = document.querySelectorAll('.btn-add-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get product name
        const productName = this.closest('.product-card').querySelector('.product-name').textContent;
        
        // Create and show notification
        showNotification(`${productName} added to cart!`);
        
        // Add animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});

// Shop Now button
const shopNowButton = document.querySelector('.hero-buttons .btn-primary');
if (shopNowButton) {
    shopNowButton.addEventListener('click', function() {
        const productsSection = document.getElementById('products');
        productsSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// Learn More button
const learnMoreButton = document.querySelector('.hero-buttons .btn-secondary');
if (learnMoreButton) {
    learnMoreButton.addEventListener('click', function() {
        const aboutSection = document.getElementById('about');
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
}

/* ========== NEWSLETTER FORM ========== */

const newsletterForm = document.getElementById('newsletterForm');
const newsletterInput = document.getElementById('newsletterInput');
const newsletterNote = document.getElementById('newsletterNote');

newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = newsletterInput.value.trim();
    
    // Simple email validation
    if (isValidEmail(email)) {
        // Show success message
        newsletterNote.textContent = '✓ Thank you for subscribing!';
        newsletterNote.classList.add('success');
        
        // Reset form
        newsletterInput.value = '';
        
        // Clear message after 5 seconds
        setTimeout(() => {
            newsletterNote.textContent = '';
            newsletterNote.classList.remove('success');
        }, 5000);
    } else {
        // Show error message
        newsletterNote.textContent = 'Please enter a valid email address.';
        newsletterNote.style.color = '#ffcccc';
        
        // Clear message after 3 seconds
        setTimeout(() => {
            newsletterNote.textContent = '';
        }, 3000);
    }
});

/* ========== HELPER FUNCTIONS ========== */

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification function (reusable)
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #f8b4d6;
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 10px 25px rgba(248, 180, 214, 0.3);
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.5s ease;
        font-family: 'Poppins', sans-serif;
    `;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

/* ========== NAVBAR SCROLL EFFECT ========== */

// Add subtle shadow on scroll
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    
    if (scrollTop > lastScrollTop) {
        // Scrolling DOWN
        navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
    } else {
        // Scrolling UP
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    lastScrollTop = scrollTop;
});

/* ========== HOVER EFFECTS ON ELEMENTS ========== */

// Add subtle scale effect to cards on hover
const cards = document.querySelectorAll('.product-card, .feature-card, .review-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
});

/* ========== KEYBOARD ACCESSIBILITY ========== */

// Ensure keyboard navigation for buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

/* ========== PAGE LOAD ANIMATION ========== */

// Fade in page on load
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

/* ========== SCROLL TO TOP BUTTON (Optional) ========== */

// Create scroll-to-top button functionality for future use
function showScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.id = 'scrollTopBtn';
    scrollButton.innerHTML = '↑';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: #f8b4d6;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(248, 180, 214, 0.3);
        font-weight: bold;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Initialize scroll-to-top button on page load
document.addEventListener('DOMContentLoaded', function() {
    showScrollToTopButton();
});

/* ========== FORM INPUT VALIDATION ========== */

// Add visual feedback to newsletter input
const newsletterInputElement = document.getElementById('newsletterInput');
if (newsletterInputElement) {
    newsletterInputElement.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 0 3px rgba(248, 180, 214, 0.2)';
    });
    
    newsletterInputElement.addEventListener('blur', function() {
        this.style.boxShadow = 'none';
    });
}

/* ========== CONSOLE MESSAGE ========== */

// Fun message in console
console.log('%c✨ Welcome to GlowCare! ✨', 'color: #f8b4d6; font-size: 18px; font-weight: bold;');
console.log('%cBeautiful skin starts here!', 'color: #555; font-size: 14px; font-style: italic;');
