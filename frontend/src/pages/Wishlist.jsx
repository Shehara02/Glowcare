import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=70';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart! 🛒`);
  };

  if (wishlistItems.length === 0) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-8xl mb-6">💕</div>
      <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-3">Your wishlist is empty</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-sm">Save your favorite products here so you can find them easily later.</p>
      <Link to="/products" className="btn-primary text-base !px-10 !py-4">
        <Heart size={18} /> Explore Products
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="container-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
            <p className="text-gray-500 mt-1">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={clearWishlist}
            className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
            <Trash2 size={15} /> Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
            <div key={item._id} className="card group overflow-hidden animate-fade-up">
              {/* Image */}
              <div className="relative h-52 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                <img
                  src={item.image || PLACEHOLDER}
                  alt={item.name}
                  onError={e => { e.target.src = PLACEHOLDER; }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Remove */}
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
                <div className="absolute top-3 left-3">
                  <Heart size={16} className="text-primary-500 fill-primary-500" />
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="badge badge-primary text-[10px] mb-1.5">{item.category}</span>
                <h3 className="font-heading text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-snug">{item.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    ${item.price?.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stock === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold transition-all hover:shadow-glow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={13} />
                    {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Move all to cart */}
        <div className="mt-8 text-center">
          <button
            onClick={() => { wishlistItems.forEach(item => addToCart(item)); toast.success('All items added to cart! 🛒'); }}
            className="btn-primary !px-10 !py-4 text-base"
          >
            <ShoppingCart size={18} /> Move All to Cart
          </button>
          <div className="mt-4">
            <Link to="/products" className="text-sm text-primary-500 hover:underline flex items-center justify-center gap-1">
              Continue Shopping <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
