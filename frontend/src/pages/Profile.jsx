import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Camera, Package, Heart, ShoppingCart, Edit2, Save, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [editing, setEditing] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: user?.name||'', email: user?.email||'', phone: user?.phone||'', currentPassword:'', newPassword:'' });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: form.name, email: form.email, phone: form.phone });
      toast.success('Profile updated! ✨');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const STATS = [
    { icon: Package, label: 'Total Orders', value: '12', color: 'text-blue-600 bg-blue-100' },
    { icon: Heart, label: 'Wishlist', value: wishlistItems.length, color: 'text-primary-600 bg-primary-100' },
    { icon: ShoppingCart, label: 'Cart Items', value: cartItems.length, color: 'text-green-600 bg-green-100' },
    { icon: Shield, label: 'Member Since', value: '2024', color: 'text-amber-600 bg-amber-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="container-xl">
        <div className="max-w-4xl mx-auto">

          {/* Header card */}
          <div className="card p-8 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-rose-50 dark:from-primary-900/20 dark:to-rose-900/20 opacity-60" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-heading text-4xl font-bold shadow-glow">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-card flex items-center justify-center text-primary-500 hover:bg-primary-50 transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-1">{user?.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-3">{user?.email}</p>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className={`badge ${user?.role==='admin'?'bg-amber-100 text-amber-700':'badge-primary'} capitalize`}>
                    {user?.role || 'Customer'}
                  </span>
                  <span className="badge badge-success">Verified</span>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className={editing ? 'btn-secondary !px-4 !py-2 text-sm' : 'btn-primary !px-4 !py-2 text-sm'}
              >
                {editing ? <><X size={15} /> Cancel</> : <><Edit2 size={15} /> Edit Profile</>}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card p-5 text-center">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={22} />
                </div>
                <div className="font-heading text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Profile Form */}
          <div className="card p-8">
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editing ? 'Edit Profile' : 'Profile Information'}
            </h2>
            <form onSubmit={handleSave}>
              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.name} onChange={e => set('name',e.target.value)} disabled={!editing}
                      className={`input-field pl-10 ${!editing?'bg-gray-50 dark:bg-gray-900 cursor-default':''}`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={form.email} onChange={e => set('email',e.target.value)} disabled={!editing}
                      className={`input-field pl-10 ${!editing?'bg-gray-50 dark:bg-gray-900 cursor-default':''}`} />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-5 mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Change Password (optional)</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Current Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type={showPass?'text':'password'} value={form.currentPassword} onChange={e=>set('currentPassword',e.target.value)} placeholder="Current password" className="input-field pl-10 pr-10" />
                        <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Eye size={15}/></button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">New Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type={showPass?'text':'password'} value={form.newPassword} onChange={e=>set('newPassword',e.target.value)} placeholder="New password" className="input-field pl-10" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {editing && (
                <button type="submit" disabled={saving} className="btn-primary !px-8 !py-3">
                  {saving ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Saving…</span> : <><Save size={16}/> Save Changes</>}
                </button>
              )}
            </form>
          </div>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <Link to="/orders" className="card p-5 flex items-center gap-4 hover:border hover:border-primary-200 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package size={22} className="text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">Order History</div>
                <div className="text-xs text-gray-500">View all past orders</div>
              </div>
            </Link>
            <Link to="/wishlist" className="card p-5 flex items-center gap-4 hover:border hover:border-primary-200 group">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart size={22} className="text-primary-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">My Wishlist</div>
                <div className="text-xs text-gray-500">{wishlistItems.length} saved items</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
