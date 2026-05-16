import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const pwStrength = () => {
    const p = form.password;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { label: '', color: '' },
      { label: 'Weak', color: 'bg-red-500' },
      { label: 'Fair', color: 'bg-amber-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];
    return { score, ...levels[score] };
  };

  const strength = pwStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) { toast.error('Passwords do not match'); return; }
    if (!agree) { toast.error('Please accept the terms'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.passwordConfirm);
      toast.success('Welcome to GlowCare! 🌸');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PERKS = ['Free shipping on first order', 'Exclusive member discounts', 'Early access to new products', 'Personalized skin recommendations'];

  return (
    <div className="min-h-screen flex pt-16">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-700 via-primary-600 to-pink-500 p-12 items-center justify-center relative overflow-hidden">
        <div className="blob w-64 h-64 bg-white/20 -top-10 -right-10 animate-float" />
        <div className="blob w-40 h-40 bg-white/15 bottom-20 -left-5 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="relative z-10 text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
            <Sparkles size={28} className="text-white" />
          </div>
          <h2 className="font-heading text-3xl font-bold mb-3">Join GlowCare</h2>
          <p className="text-white/80 text-base mb-8 leading-relaxed">Create your account and unlock a world of premium skincare.</p>
          <div className="space-y-3">
            {PERKS.map(perk => (
              <div key={perk} className="flex items-center gap-3 bg-white/15 backdrop-blur rounded-xl px-4 py-3">
                <CheckCircle size={16} className="text-green-300 shrink-0" />
                <span className="text-sm text-white/90">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 bg-white dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md py-8 animate-fade-up">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-heading text-2xl font-bold text-gradient">GlowCare</span>
          </div>

          <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in →</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Doe" className="input-field pl-11" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@email.com" className="input-field pl-11" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" className="input-field pl-11 pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                    ))}
                  </div>
                  {strength.label && <p className="text-xs text-gray-500">Strength: <span className="font-medium">{strength.label}</span></p>}
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} required value={form.passwordConfirm} onChange={e => set('passwordConfirm', e.target.value)} placeholder="Repeat your password" className="input-field pl-11" />
                {form.passwordConfirm && form.password === form.passwordConfirm && (
                  <CheckCircle size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
            </div>

            {/* Agree */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-500 accent-primary-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                I agree to the <a href="#" className="text-primary-500 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4 !text-base">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating account…</span>
              ) : (
                <><ArrowRight size={18} /> Create Account</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
