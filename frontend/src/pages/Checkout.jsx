import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [shipping, setShipping] = useState({ firstName:'', lastName:'', address:'', city:'', state:'', zip:'', country:'US', phone:'' });
  const [payment, setPayment] = useState({ cardNumber:'', expiry:'', cvv:'', name:'' });

  const subtotal = getTotalPrice();
  const shippingFee = subtotal >= 50 ? 0 : 5.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shippingFee + tax).toFixed(2);

  const setS = (k, v) => setShipping(p => ({ ...p, [k]: v }));
  const setP = (k, v) => setPayment(p => ({ ...p, [k]: v }));

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    }, 2000);
  };

  const fmtCard = (v) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const fmtExpiry = (v) => v.replace(/\D/g,'').slice(0,4).replace(/(.{2})/,'$1/').replace(/\/$/,'');

  const inputCls = 'input-field text-sm';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="container-xl max-w-5xl">
        {/* Back */}
        <Link to="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? 'bg-primary-500 text-white shadow-glow' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i <= step ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${i < step ? 'bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* STEP 0 — Shipping */}
            {step === 0 && (
              <div className="card p-7 animate-fade-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Truck size={20} className="text-blue-600" /></div>
                  <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white">Shipping Address</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[['firstName','First Name'],['lastName','Last Name']].map(([k,l]) => (
                    <div key={k}>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{l} *</label>
                      <input type="text" required value={shipping[k]} onChange={e=>setS(k,e.target.value)} placeholder={l} className={inputCls} />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Street Address *</label>
                    <input type="text" required value={shipping.address} onChange={e=>setS('address',e.target.value)} placeholder="123 Main Street" className={inputCls} />
                  </div>
                  {[['city','City'],['state','State'],['zip','ZIP Code']].map(([k,l]) => (
                    <div key={k}>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{l} *</label>
                      <input type="text" required value={shipping[k]} onChange={e=>setS(k,e.target.value)} placeholder={l} className={inputCls} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Phone</label>
                    <input type="tel" value={shipping.phone} onChange={e=>setS('phone',e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls} />
                  </div>
                </div>
                <button onClick={() => setStep(1)} className="btn-primary mt-6 !px-8 !py-3.5">
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 1 — Payment */}
            {step === 1 && (
              <div className="card p-7 animate-fade-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center"><CreditCard size={20} className="text-primary-600" /></div>
                  <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                  <Lock size={16} className="text-green-500 ml-auto" />
                </div>

                {/* Card preview */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white mb-6 shadow-glow">
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-sm font-medium opacity-80">GlowCare Card</div>
                    <CreditCard size={28} className="opacity-60" />
                  </div>
                  <div className="font-mono text-xl tracking-widest mb-4">
                    {(payment.cardNumber || '•••• •••• •••• ••••').padEnd(19,'•').slice(0,19)}
                  </div>
                  <div className="flex justify-between text-sm">
                    <div><div className="text-[10px] opacity-60 uppercase">Card Holder</div><div className="font-medium">{payment.name||'Your Name'}</div></div>
                    <div><div className="text-[10px] opacity-60 uppercase">Expires</div><div className="font-medium">{payment.expiry||'MM/YY'}</div></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Cardholder Name *</label>
                    <input type="text" required value={payment.name} onChange={e=>setP('name',e.target.value)} placeholder="Jane Doe" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Card Number *</label>
                    <input type="text" required value={payment.cardNumber} onChange={e=>setP('cardNumber',fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} className={`${inputCls} font-mono tracking-widest`} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Expiry Date *</label>
                      <input type="text" required value={payment.expiry} onChange={e=>setP('expiry',fmtExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">CVV *</label>
                      <input type="text" required value={payment.cvv} onChange={e=>setP('cvv',e.target.value.replace(/\D/,'').slice(0,4))} placeholder="•••" maxLength={4} className={`${inputCls} font-mono`} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="btn-secondary !px-6 !py-3">← Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary !px-8 !py-3">Review Order →</button>
                </div>
              </div>
            )}

            {/* STEP 2 — Review */}
            {step === 2 && (
              <div className="card p-7 animate-fade-up">
                <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-6">Review Your Order</h2>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <img src={item.image||'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=60'} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" onError={e=>{e.target.src='https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=60';}} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-primary-600">${(item.price*item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 text-sm space-y-1">
                  <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Shipping to:</div>
                  <p className="text-gray-600 dark:text-gray-400">{shipping.firstName} {shipping.lastName}</p>
                  <p className="text-gray-600 dark:text-gray-400">{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary !px-6 !py-3">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary flex-1 justify-center !py-3.5">
                    {placing ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Placing order…</span> : <>Place Order · ${total}</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="card p-6 h-fit sticky top-28">
            <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-4">Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              {[['Subtotal', `$${subtotal.toFixed(2)}`],['Shipping', shippingFee===0?'Free':`$${shippingFee.toFixed(2)}`],['Tax (8%)', `$${tax}`]].map(([l,v])=>(
                <div key={l} className="flex justify-between text-gray-600 dark:text-gray-400"><span>{l}</span><span className="font-medium">{v}</span></div>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total</span><span className="text-primary-600">${total}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-4">
              <Lock size={12} className="text-green-500" />
              <span>256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
