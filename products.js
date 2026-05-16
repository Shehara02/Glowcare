/* ========================================
   GLOWCARE - PRODUCTS DATABASE
   ======================================== */

const PRODUCTS = [
    {
        id: 1,
        name: "Hydrating Moisturizer",
        price: 45.00,
        category: "moisturizer",
        skinType: "all",
        image: "images/moisturizer.jpg",
        description: "Luxurious daily moisturizer with natural ingredients"
    },
    {
        id: 2,
        name: "Vitamin C Serum",
        price: 55.00,
        category: "serum",
        skinType: "all",
        image: "images/vitamin C.jpg",
        description: "Brightening serum for radiant, glowing skin"
    },
    {
        id: 3,
        name: "Gentle Face Cleanser",
        price: 28.00,
        category: "cleanser",
        skinType: "all",
        image: "images/cleanser.jpg",
        description: "Soft cleansing formula for all skin types"
    },
    {
        id: 4,
        name: "Night Recovery Mask",
        price: 52.00,
        category: "moisturizer",
        skinType: "all",
        image: "images/night recovery mask.jpg",
        description: "Intensive overnight treatment for deep hydration"
    },
    {
        id: 5,
        name: "Deep Clean Gel Cleanser",
        price: 32.00,
        category: "cleanser",
        skinType: "oily",
        image: "images/cleanser.jpg",
        description: "Oil-control cleanser for oily and acne-prone skin"
    },
    {
        id: 6,
        name: "Hyaluronic Acid Serum",
        price: 48.00,
        category: "serum",
        skinType: "dry",
        image: "images/vitamin C.jpg",
        description: "Intensive hydration serum for dry, dehydrated skin"
    },
    {
        id: 7,
        name: "Sensitive Skin Cleanser",
        price: 30.00,
        category: "cleanser",
        skinType: "sensitive",
        image: "images/cleanser.jpg",
        description: "Gentle, non-irritating cleanser for sensitive skin"
    },
    {
        id: 8,
        name: "Anti-Wrinkle Eye Cream",
        price: 58.00,
        category: "serum",
        skinType: "all",
        image: "images/vitamin C.jpg",
        description: "Advanced formula to reduce fine lines and wrinkles"
    },
    {
        id: 9,
        name: "Moisturizing Oil Cleanser",
        price: 35.00,
        category: "cleanser",
        skinType: "dry",
        image: "images/cleanser.jpg",
        description: "Rich oil cleanser for gentle makeup removal"
    },
    {
        id: 10,
        name: "Niacinamide Serum",
        price: 42.00,
        category: "serum",
        skinType: "oily",
        image: "images/vitamin C.jpg",
        description: "Pore-minimizing serum for oily, combination skin"
    },
    {
        id: 11,
        name: "Calming Moisturizer",
        price: 48.00,
        category: "moisturizer",
        skinType: "sensitive",
        image: "images/moisturizer.jpg",
        description: "Soothing moisturizer with chamomile and aloe"
    },
    {
        id: 12,
        name: "Sunscreen Lotion SPF 50",
        price: 38.00,
        category: "moisturizer",
        skinType: "all",
        image: "images/moisturizer.jpg",
        description: "Lightweight daily sunscreen protection"
    }
];

// Function to get all products
function getAllProducts() {
    return PRODUCTS;
}

// Function to get product by ID
function getProductById(id) {
    return PRODUCTS.find(product => product.id === id);
}

// Function to get products by category
function getProductsByCategory(category) {
    if (category === 'all') return PRODUCTS;
    return PRODUCTS.filter(product => product.category === category);
}

// Function to get products by skin type
function getProductsBySkinType(skinType) {
    if (skinType === 'all') return PRODUCTS;
    return PRODUCTS.filter(product => product.skinType === skinType);
}

// Function to get products by multiple filters
function filterProducts(category, skinType) {
    let filtered = PRODUCTS;
    
    if (category && category !== 'all') {
        filtered = filtered.filter(product => product.category === category);
    }
    
    if (skinType && skinType !== 'all') {
        filtered = filtered.filter(product => product.skinType === skinType);
    }
    
    return filtered;
}

// Function to search products by name or description
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
}
