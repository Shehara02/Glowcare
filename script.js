/* ========================================
   GLOWCARE - MAIN APPLICATION SCRIPT
   ======================================== */

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Render initial products
    renderProducts(getAllProducts(), 'products-grid');
    
    // Update cart and wishlist displays
    updateCartSummary();
    updateWishlistDisplay();
    
    // Attach event listeners
    attachAllEventListeners();
});

// ========== HAMBURGER MENU FUNCTIONALITY ==========
function attachAllEventListeners() {
    // Hamburger Menu
    const hamburgerMenu = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a navigation link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', function(event) {
        if (navMenu && hamburgerMenu) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburgerMenu.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

    // Cart Modal
    attachCartModalListeners();
    
    // Wishlist Modal
    attachWishlistModalListeners();
    
    // Search Functionality
    attachSearchListeners();
    
    // Filter Functionality
    attachFilterListeners();
    
    // Theme Toggle
    attachThemeToggleListener();
    
    // Newsletter Form
    attachNewsletterListener();
    
    // Scroll Animations
    attachScrollAnimations();
    
    // Button Interactions
    attachButtonInteractions();
}

// ========== CART MODAL FUNCTIONALITY ==========
function attachCartModalListeners() {
    const cartToggle = document.getElementById('cart-toggle');
    const cartModal = document.getElementById('cart-modal');
    const cartClose = document.getElementById('cart-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Open cart modal
    if (cartToggle) {
        cartToggle.addEventListener('click', function() {
            cartModal.classList.add('active');
            modalOverlay.classList.add('active');
            renderCartItems();
        });
    }

    // Close cart modal
    if (cartClose) {
        cartClose.addEventListener('click', closeCartModal);
    }

    // Close on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeCartModal();
                closeWishlistModal();
            }
        });
    }

    // Clear cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                Cart.clearCart();
                renderCartItems();
                updateCartSummary();
                showNotification('Cart cleared');
            }
        });
    }

    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const total = Cart.getTotalPrice();
            if (total > 0) {
                showNotification('Proceeding to checkout... Feature coming soon!');
            } else {
                showNotification('Your cart is empty', 'error');
            }
        });
    }
}

function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    cartModal.classList.remove('active');
    if (!document.getElementById('wishlist-modal').classList.contains('active')) {
        modalOverlay.classList.remove('active');
    }
}

// ========== WISHLIST MODAL FUNCTIONALITY ==========
function attachWishlistModalListeners() {
    const wishlistToggle = document.getElementById('wishlist-toggle');
    const wishlistModal = document.getElementById('wishlist-modal');
    const wishlistClose = document.getElementById('wishlist-close');
    const modalOverlay = document.getElementById('modal-overlay');

    // Open wishlist modal
    if (wishlistToggle) {
        wishlistToggle.addEventListener('click', function() {
            wishlistModal.classList.add('active');
            modalOverlay.classList.add('active');
            renderWishlistItems();
        });
    }

    // Close wishlist modal
    if (wishlistClose) {
        wishlistClose.addEventListener('click', closeWishlistModal);
    }
}

function closeWishlistModal() {
    const wishlistModal = document.getElementById('wishlist-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    wishlistModal.classList.remove('active');
    if (!document.getElementById('cart-modal').classList.contains('active')) {
        modalOverlay.classList.remove('active');
    }
}

// ========== RENDER WISHLIST ITEMS ==========
function renderWishlistItems() {
    const wishlistItems = Wishlist.getWishlist();
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    
    if (!wishlistItemsContainer) return;

    if (wishlistItems.length === 0) {
        wishlistItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <p style="font-size: 1.1rem; color: #999;">Your wishlist is empty</p>
                <p style="color: #bbb; margin-top: 10px;">Add your favorite products!</p>
            </div>
        `;
        return;
    }

    wishlistItemsContainer.innerHTML = wishlistItems.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
            <div class="wishlist-item-info">
                <h4 class="wishlist-item-name">${item.name}</h4>
                <p class="wishlist-item-price">${formatCurrency(item.price)}</p>
            </div>
            <div class="wishlist-item-actions">
                <button class="btn-wishlist-add" data-product-id="${item.id}" title="Add to Cart">Add</button>
                <button class="btn-wishlist-remove" data-product-id="${item.id}" title="Remove">×</button>
            </div>
        </div>
    `).join('');

    // Attach wishlist item event listeners
    attachWishlistItemListeners();
}

function attachWishlistItemListeners() {
    // Add to cart from wishlist
    document.querySelectorAll('.btn-wishlist-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            const product = getProductById(productId);
            
            if (product) {
                Cart.addToCart(product);
                updateCartSummary();
                showNotification(`${product.name} added to cart!`);
                btn.textContent = 'Added!';
                setTimeout(() => {
                    btn.textContent = 'Add';
                }, 1500);
            }
        });
    });

    // Remove from wishlist
    document.querySelectorAll('.btn-wishlist-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            Wishlist.removeFromWishlist(productId);
            updateWishlistDisplay();
            renderWishlistItems();
            showNotification('Removed from wishlist');
        });
    });
}

// ========== SEARCH FUNCTIONALITY ==========
function attachSearchListeners() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    function performSearch() {
        const query = searchInput.value.trim();
        
        if (query === '') {
            renderProducts(getAllProducts(), 'products-grid');
        } else {
            const results = searchProducts(query);
            renderProducts(results, 'products-grid');
        }
    }

    if (searchInput) {
        // Search on input
        searchInput.addEventListener('input', performSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

// ========== FILTER FUNCTIONALITY ==========
function attachFilterListeners() {
    const categoryFilter = document.getElementById('category-filter');
    const skintypeFilter = document.getElementById('skintype-filter');
    const resetFiltersBtn = document.getElementById('reset-filters');

    function applyFilters() {
        const category = categoryFilter ? categoryFilter.value : 'all';
        const skinType = skintypeFilter ? skintypeFilter.value : 'all';
        
        const filtered = filterProducts(category, skinType);
        renderProducts(filtered, 'products-grid');
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    if (skintypeFilter) {
        skintypeFilter.addEventListener('change', applyFilters);
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            if (categoryFilter) categoryFilter.value = 'all';
            if (skintypeFilter) skintypeFilter.value = 'all';
            if (searchInput) {
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.value = '';
            }
            renderProducts(getAllProducts(), 'products-grid');
            showNotification('Filters reset');
        });
    }
}

// ========== THEME TOGGLE ==========
function attachThemeToggleListener() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// ========== NEWSLETTER FORM ==========
function attachNewsletterListener() {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterInput = document.getElementById('newsletterInput');
    const newsletterNote = document.getElementById('newsletterNote');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterInput.value.trim();
            
            if (email) {
                // Store email (in a real app, send to server)
                localStorage.setItem('newsletter_email', email);
                
                newsletterNote.textContent = '✓ Successfully subscribed! Check your email.';
                newsletterNote.classList.add('success');
                newsletterInput.value = '';
                
                showNotification('Thank you for subscribing!');
                
                setTimeout(() => {
                    newsletterNote.textContent = '';
                    newsletterNote.classList.remove('success');
                }, 5000);
            }
        });
    }
}

// ========== SCROLL ANIMATIONS ==========
function attachScrollAnimations() {
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

    // Observe all relevant elements
    const animatedElements = document.querySelectorAll(
        '.product-card, .feature-card, .review-card, .section-header'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// ========== BUTTON INTERACTIONS ==========
function attachButtonInteractions() {
    // Hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (btn.textContent.includes('Shop')) {
                // Scroll to products
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            } else if (btn.textContent.includes('Learn')) {
                // Scroll to features
                document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

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
}

// ========== PAGE VISIBILITY - UPDATE CART COUNT ==========
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Update cart and wishlist when user returns to page
        updateCartSummary();
        updateWishlistDisplay();
    }
});

// ========== STICKY NAVBAR ON SCROLL ==========
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeCartModal();
        closeWishlistModal();
    }
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
