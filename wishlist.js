/* ========================================
   GLOWCARE - WISHLIST MANAGEMENT
   ======================================== */

const WISHLIST_STORAGE_KEY = 'glowcare_wishlist';

// Wishlist object with methods
const Wishlist = {
    // Get wishlist from localStorage
    getWishlist() {
        const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return wishlist ? JSON.parse(wishlist) : [];
    },

    // Save wishlist to localStorage
    saveWishlist(wishlist) {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    },

    // Add product to wishlist
    addToWishlist(product) {
        const wishlist = this.getWishlist();
        
        // Check if product already exists
        if (!wishlist.find(item => item.id === product.id)) {
            wishlist.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            });
        }

        this.saveWishlist(wishlist);
        return wishlist;
    },

    // Remove product from wishlist
    removeFromWishlist(productId) {
        const wishlist = this.getWishlist();
        const filteredWishlist = wishlist.filter(item => item.id !== productId);
        this.saveWishlist(filteredWishlist);
        return filteredWishlist;
    },

    // Toggle product in wishlist
    toggleWishlist(product) {
        if (this.isInWishlist(product.id)) {
            return this.removeFromWishlist(product.id);
        } else {
            return this.addToWishlist(product);
        }
    },

    // Get total items in wishlist
    getWishlistCount() {
        const wishlist = this.getWishlist();
        return wishlist.length;
    },

    // Check if product is in wishlist
    isInWishlist(productId) {
        const wishlist = this.getWishlist();
        return wishlist.some(item => item.id === productId);
    },

    // Clear entire wishlist
    clearWishlist() {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
        return [];
    }
};
