import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🌸');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-16">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-500 to-pink-400 overflow-hidden items-center justify-center p-12">
        <div className="blob w-72 h-72 bg-white/20 -top-16 -left-16 animate-float" />
        <div className="blob w-48 h-48 bg-white/15 bottom-10 right-10 animate-float" style={{ animationDelay: '2s' }} />
        <div className="relative z-10 text-white text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-8">
            <Sparkles size={36} className="text-white" />
          </div>
          <h2 className="font-heading text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-xs mx-auto">
            Sign in to access your personalized skincare dashboard and exclusive deals.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[['🌿', 'Natural'], ['🐰', 'Cruelty-Free'], ['⭐', '5-Star']].map(([e, l]) => (
              <div key={l} className="bg-white/15 rounded-2xl p-4">
                <div className="text-2xl mb-1">{e}</div>
                <div className="text-xs text-white/80 font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md animate-fade-up">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-heading text-2xl font-bold text-gradient">GlowCare</span>
          </div>

          <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one →</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="jane@email.com" className="input-field pl-11" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-xs text-primary-500 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={show ? 'text' : 'password'} required value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="Enter your password" className="input-field pl-11 pr-12" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4 !text-base mt-2">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in…</span>
              ) : (
                <><ArrowRight size={18} /> Sign In</>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">🔑 Demo Credentials</p>
            <p className="text-xs text-amber-600 dark:text-amber-500">Admin: admin@glowcare.com / Admin@123456</p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-500 hover:underline">Terms of Service</a>{' '}and{' '}
            <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
