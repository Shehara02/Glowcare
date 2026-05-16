import React, { useState } from 'react';
import { X, Star, ShoppingCart, Heart, Minus, Plus, ChevronLeft, ChevronRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={15} className={i<=Math.round(rating)?'text-amber-400 fill-amber-400':'text-gray-300'} />
    ))}
    <span className="ml-1.5 text-sm text-gray-500">({rating?.toFixed(1)||'0.0'} · {0} reviews)</span>
  </div>
);

const PLACEHOLDER = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80';

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const wishlisted = isWishlisted(product._id);
  const images = product.images?.length > 0 ? product.images : [product.image || PLACEHOLDER];

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${qty}× ${product.name} added to cart! 🛒`);
  };

  const tabs = ['description','ingredients','usage'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* ─ Images ─ */}
          <div className="relative bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-tl-3xl rounded-bl-none md:rounded-bl-3xl rounded-tr-3xl md:rounded-tr-none p-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
              <img
                src={images[activeImg] || PLACEHOLDER}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = PLACEHOLDER; }}
              />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i-1+images.length)%images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setActiveImg(i => (i+1)%images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${i===activeImg?'border-primary-500 shadow-glow':'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img||PLACEHOLDER} alt="" className="w-full h-full object-cover" onError={e=>{e.target.src=PLACEHOLDER;}} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─ Details ─ */}
          <div className="p-7 overflow-y-auto max-h-[85vh]">
            {/* Category & badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-primary text-xs">{product.category}</span>
              {product.isBestSeller && <span className="badge bg-amber-100 text-amber-700 text-xs">⭐ Bestseller</span>}
              {product.stock === 0 && <span className="badge badge-danger text-xs">Out of Stock</span>}
            </div>

            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{product.name}</h2>
            <div className="mb-4"><StarRating rating={product.rating} /></div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">${product.price?.toFixed(2)}</span>
              {product.originalPrice && <span className="text-lg text-gray-400 line-through">${product.originalPrice?.toFixed(2)}</span>}
              {product.originalPrice && <span className="badge badge-danger">-{Math.round(((product.originalPrice-product.price)/product.originalPrice)*100)}%</span>}
            </div>

            {/* Skin types */}
            {product.skinType?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-xs text-gray-500 font-medium">Skin type:</span>
                {product.skinType.map(t => (
                  <span key={t} className="text-xs px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">{t}</span>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="mb-5">
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4">
                {tabs.map(t => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${activeTab===t?'bg-white dark:bg-gray-700 text-primary-600 shadow-sm':'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed min-h-[80px]">
                {activeTab==='description' && <p>{product.description || 'No description available.'}</p>}
                {activeTab==='ingredients' && (
                  product.ingredients?.length > 0
                    ? <ul className="space-y-1">{product.ingredients.map((ing,i) => <li key={i} className="flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span>{ing}</li>)}</ul>
                    : <p className="text-gray-400">No ingredient information available.</p>
                )}
                {activeTab==='usage' && <p>{product.usage || 'No usage instructions available.'}</p>}
              </div>
            </div>

            {/* Qty selector */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock||10,q+1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-gray-400">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} disabled={product.stock===0}
                className={`flex-1 btn-primary justify-center ${product.stock===0?'opacity-50 cursor-not-allowed':''}`}>
                <ShoppingCart size={17} /> Add to Cart
              </button>
              <button onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${wishlisted?'border-primary-500 bg-primary-50 text-primary-500':'border-gray-200 hover:border-primary-300 text-gray-400 hover:text-primary-500'}`}>
                <Heart size={18} className={wishlisted?'fill-current':''} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                [Shield,'Secure Payment'],
                [Truck,'Free Shipping $50+'],
                [RotateCcw,'30-Day Returns'],
              ].map(([Icon, label]) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Icon size={16} className="text-primary-500" />
                  <span className="text-[10px] text-gray-500 text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
