/* ========================================
   GLOWCARE - CART MANAGEMENT
   ======================================== */

const CART_STORAGE_KEY = 'glowcare_cart';

// Cart object with methods
const Cart = {
    // Get cart from localStorage
    getCart() {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to localStorage
    saveCart(cart) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    },

    // Add product to cart
    addToCart(product) {
        const cart = this.getCart();
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart(cart);
        return cart;
    },

    // Remove product from cart
    removeFromCart(productId) {
        const cart = this.getCart();
        const filteredCart = cart.filter(item => item.id !== productId);
        this.saveCart(filteredCart);
        return filteredCart;
    },

    // Update product quantity
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const product = cart.find(item => item.id === productId);

        if (product) {
            if (quantity <= 0) {
                return this.removeFromCart(productId);
            }
            product.quantity = quantity;
            this.saveCart(cart);
        }

        return cart;
    },

    // Get cart total price
    getTotalPrice() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Get total items count
    getTotalItems() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Clear entire cart
    clearCart() {
        localStorage.removeItem(CART_STORAGE_KEY);
        return [];
    },

    // Check if product is in cart
    isInCart(productId) {
        const cart = this.getCart();
        return cart.some(item => item.id === productId);
    },

    // Get cart item by ID
    getCartItem(productId) {
        const cart = this.getCart();
        return cart.find(item => item.id === productId);
    }
};
