import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

/* Fallback gradient placeholder image */
const PLACEHOLDER = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(n => (
      <Star
        key={n}
        size={12}
        className={n <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
      />
    ))}
    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({rating?.toFixed(1) || '0.0'})</span>
  </div>
);

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [imgError, setImgError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const categoryColors = {
    cleanser:    'bg-blue-100 text-blue-700',
    serum:       'bg-purple-100 text-purple-700',
    moisturizer: 'bg-green-100 text-green-700',
    mask:        'bg-pink-100 text-pink-700',
    sunscreen:   'bg-amber-100 text-amber-700',
    other:       'bg-gray-100 text-gray-700',
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="product-card group cursor-pointer bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
      onClick={() => onViewDetails && onViewDetails(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56 bg-gradient-to-br from-rose-soft to-cream-100">
        <img
          src={imgError ? PLACEHOLDER : (product.image || PLACEHOLDER)}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="card-overlay" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isBestSeller && (
            <span className="badge bg-amber-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              ⭐ Bestseller
            </span>
          )}
          {discount && (
            <span className="badge bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-gray-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            wishlisted
              ? 'bg-primary-500 text-white scale-110'
              : 'bg-white/90 text-gray-500 hover:bg-primary-50 hover:text-primary-500'
          }`}
        >
          <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
        </button>

        {/* Quick view on hover */}
        <button
          onClick={(e) => { e.stopPropagation(); onViewDetails && onViewDetails(product); }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap"
        >
          <Eye size={13} /> Quick View
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[product.category] || categoryColors.other}`}>
            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
          </span>
          {product.skinType?.length > 0 && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {product.skinType.join(', ')}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-heading text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={product.rating} />
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              ${product.price?.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isAdding
                ? 'bg-primary-400 text-white scale-95'
                : 'bg-primary-500 hover:bg-primary-600 text-white hover:shadow-glow active:scale-95'
            }`}
          >
            <ShoppingCart size={14} />
            {isAdding ? 'Added!' : product.stock === 0 ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
