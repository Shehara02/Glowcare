import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Send, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success('Thank you for subscribing! 🌸');
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About Us', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
    { label: 'FAQ', href: '/#faq' },
  ];

  const shopLinks = [
    { label: 'Cleansers', href: '/products?category=cleanser' },
    { label: 'Serums', href: '/products?category=serum' },
    { label: 'Moisturizers', href: '/products?category=moisturizer' },
    { label: 'Face Masks', href: '/products?category=mask' },
    { label: 'Sunscreen', href: '/products?category=sunscreen' },
  ];

  const socials = [
    { Icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { Icon: Facebook,  href: '#', label: 'Facebook',  color: 'hover:text-blue-500' },
    { Icon: Twitter,   href: '#', label: 'Twitter',   color: 'hover:text-sky-400' },
    { Icon: Youtube,   href: '#', label: 'YouTube',   color: 'hover:text-red-500' },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={13} /> Exclusive Offers
          </div>
          <h3 className="font-heading text-3xl md:text-4xl text-white font-bold mb-3">
            Glow Up Your Inbox ✨
          </h3>
          <p className="text-white/80 mb-8 text-base">
            Subscribe for skincare tips, exclusive deals, and first access to new products.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3.5 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white focus:bg-white/30 transition-all duration-200 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={subscribed}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-primary-600 font-semibold text-sm hover:bg-gray-50 hover:shadow-lg active:scale-95 transition-all duration-300 whitespace-nowrap"
            >
              <Send size={15} />
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="font-heading text-2xl font-bold text-gradient">GlowCare</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium natural skincare crafted with love. We believe healthy, radiant skin is achievable for everyone.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 ${color} hover:bg-gray-700 transition-all duration-200 hover:scale-110`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  {link.href.startsWith('/#') ? (
                    <a href={link.href}
                      className="text-gray-400 text-sm hover:text-primary-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href}
                      className="text-gray-400 text-sm hover:text-primary-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href}
                    className="text-gray-400 text-sm hover:text-primary-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-4">
              <a href="mailto:hello@glowcare.com" className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-primary-900/50 flex items-center justify-center shrink-0 group-hover:bg-primary-800 transition-colors">
                  <Mail size={14} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-gray-300 group-hover:text-primary-400 transition-colors">hello@glowcare.com</p>
                </div>
              </a>
              <a href="tel:+15551234567" className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-primary-900/50 flex items-center justify-center shrink-0 group-hover:bg-primary-800 transition-colors">
                  <Phone size={14} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-gray-300 group-hover:text-primary-400 transition-colors">+1 (555) 123-4567</p>
                </div>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-900/50 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">Location</p>
                  <p className="text-sm text-gray-300">New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs flex items-center gap-1">
            © {new Date().getFullYear()} GlowCare. Made with <Heart size={12} className="text-primary-500 fill-primary-500" /> for your skin.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
