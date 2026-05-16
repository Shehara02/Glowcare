import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=70';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const subtotal  = getTotalPrice();
  const shipping  = subtotal >= 50 || subtotal === 0 ? 0 : 5.99;
  const tax       = +(subtotal * 0.08).toFixed(2);
  const total     = +(subtotal + shipping + tax).toFixed(2);

  if (cartItems.length === 0) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-8xl mb-6">🛒</div>
      <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-sm">Looks like you haven't added any products yet. Explore our skincare collection!</p>
      <Link to="/products" className="btn-primary text-base !px-10 !py-4">
        <ShoppingBag size={18} /> Shop Now
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="container-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
            <p className="text-gray-500 mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => { clearCart(); toast.success('Cart cleared'); }}
            className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
            <Trash2 size={15} /> Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="card p-5 flex gap-5 items-start animate-fade-up">
                <img
                  src={item.image || PLACEHOLDER}
                  alt={item.name}
                  onError={e => { e.target.src = PLACEHOLDER; }}
                  className="w-24 h-24 object-cover rounded-2xl bg-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="badge badge-primary text-[10px] mb-1">{item.category}</span>
                      <h3 className="font-heading text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">{item.name}</h3>
                    </div>
                    <button onClick={() => { removeFromCart(item._id); toast.success('Removed from cart'); }}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0">
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty */}
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    {/* Price */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">${item.price?.toFixed(2)} each</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-28">
              <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-800 dark:text-gray-200'}`}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">${tax}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-xl text-primary-600 dark:text-primary-400">${total}</span>
                  </div>
                </div>
              </div>

              {/* Promo */}
              <div className="flex gap-2 mb-5">
                <div className="relative flex-1">
                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Promo code" className="input-field pl-9 text-sm !py-2.5" />
                </div>
                <button className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl transition-colors">
                  Apply
                </button>
              </div>

              {shipping > 0 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-5">
                  <Truck size={15} className="text-amber-600" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Add <strong>${(50 - subtotal).toFixed(2)}</strong> more for free shipping!
                  </p>
                </div>
              )}

              <Link to="/checkout" className="btn-primary w-full justify-center !py-4 !text-base mb-3">
                Proceed to Checkout <ArrowRight size={17} />
              </Link>
              <Link to="/products" className="btn-secondary w-full justify-center !py-3 text-sm">
                Continue Shopping
              </Link>

              {/* Trust */}
              <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Shield size={13} className="text-green-500" /> Secure Payment
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Truck size={13} className="text-blue-500" /> Fast Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
