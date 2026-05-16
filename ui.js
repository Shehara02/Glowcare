/* ========================================
   GLOWCARE - UI UTILITIES
   ======================================== */

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== FORMAT CURRENCY ==========
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// ========== RENDER PRODUCT GRID ==========
function renderProducts(products, containerId = 'products-grid') {
    const container = document.getElementById(containerId);
    
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
                <p style="font-size: 1.2rem; color: #999;">No products found</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="btn-quick-view" data-product-id="${product.id}">Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                    <button class="wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
                        <span class="heart-icon">♡</span>
                    </button>
                </div>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${formatCurrency(product.price)}</p>
                <button class="btn btn-add-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to dynamically created buttons
    attachProductEventListeners();
}

// ========== RENDER CART ITEMS ==========
function renderCartItems() {
    const cartItems = Cart.getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; grid-column: 1/-1;">
                <p style="font-size: 1.1rem; color: #999;">Your cart is empty</p>
                <p style="color: #bbb; margin-top: 10px;">Add some products to get started!</p>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">${formatCurrency(item.price)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn qty-decrease" data-product-id="${item.id}">−</button>
                <input type="number" class="qty-input" value="${item.quantity}" data-product-id="${item.id}" min="1">
                <button class="qty-btn qty-increase" data-product-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">
                ${formatCurrency(item.price * item.quantity)}
            </div>
            <button class="cart-item-remove" data-product-id="${item.id}" title="Remove">×</button>
        </div>
    `).join('');

    updateCartSummary();
    attachCartEventListeners();
}

// ========== UPDATE CART SUMMARY ==========
function updateCartSummary() {
    const totalPrice = Cart.getTotalPrice();
    const totalItems = Cart.getTotalItems();
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');

    if (cartTotal) {
        cartTotal.textContent = formatCurrency(totalPrice);
    }

    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Update navbar cart count
    const navbarCartCount = document.getElementById('navbar-cart-count');
    if (navbarCartCount) {
        navbarCartCount.textContent = totalItems;
        navbarCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// ========== UPDATE WISHLIST DISPLAY ==========
function updateWishlistDisplay() {
    const wishlistCount = Wishlist.getWishlistCount();
    const wishlistCountEl = document.getElementById('wishlist-count');
    
    if (wishlistCountEl) {
        wishlistCountEl.textContent = wishlistCount;
        wishlistCountEl.style.display = wishlistCount > 0 ? 'flex' : 'none';
    }

    // Update heart icons on all product cards
    const allProducts = getAllProducts();
    allProducts.forEach(product => {
        const wishlistBtn = document.querySelector(`[data-product-id="${product.id}"].wishlist-btn`);
        if (wishlistBtn) {
            if (Wishlist.isInWishlist(product.id)) {
                wishlistBtn.classList.add('in-wishlist');
                wishlistBtn.querySelector('.heart-icon').textContent = '♥';
            } else {
                wishlistBtn.classList.remove('in-wishlist');
                wishlistBtn.querySelector('.heart-icon').textContent = '♡';
            }
        }
    });
}

// ========== TOGGLE THEME ==========
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('glowcare_theme', newTheme);
    
    // Update toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

// ========== INITIALIZE THEME ==========
function initializeTheme() {
    const savedTheme = localStorage.getItem('glowcare_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// ========== ANIMATE ELEMENT ==========
function animateElement(element, animationClass = 'fadeIn', duration = 300) {
    element.style.animation = `${animationClass} ${duration}ms ease-in-out`;
}

// ========== ATTACH CART EVENT LISTENERS ==========
function attachCartEventListeners() {
    // Quantity buttons
    document.querySelectorAll('.qty-decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            const currentItem = Cart.getCartItem(productId);
            if (currentItem && currentItem.quantity > 1) {
                Cart.updateQuantity(productId, currentItem.quantity - 1);
                renderCartItems();
            }
        });
    });

    document.querySelectorAll('.qty-increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            const currentItem = Cart.getCartItem(productId);
            if (currentItem) {
                Cart.updateQuantity(productId, currentItem.quantity + 1);
                renderCartItems();
            }
        });
    });

    // Quantity input
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            const quantity = parseInt(e.target.value);
            
            if (quantity > 0) {
                Cart.updateQuantity(productId, quantity);
                renderCartItems();
            }
        });
    });

    // Remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            Cart.removeFromCart(productId);
            renderCartItems();
            showNotification('Product removed from cart');
        });
    });
}

// ========== ATTACH PRODUCT EVENT LISTENERS ==========
function attachProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(btn.dataset.productId);
            const product = getProductById(productId);
            
            if (product) {
                Cart.addToCart(product);
                updateCartSummary();
                showNotification(`${product.name} added to cart!`);
                
                // Button animation
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 100);
            }
        });
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(btn.dataset.productId);
            const product = getProductById(productId);
            
            if (product) {
                Wishlist.toggleWishlist(product);
                updateWishlistDisplay();
                
                const isInWishlist = Wishlist.isInWishlist(productId);
                showNotification(
                    isInWishlist ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist`
                );
            }
        });
    });
}
