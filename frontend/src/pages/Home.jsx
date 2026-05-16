import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronDown, ChevronUp, ArrowRight, Leaf, Shield, Award, Recycle, Send, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Quote } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { productService } from '../services/productService';

/* ─── Star Rating ─── */
const Stars = ({ n }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={14} className={i <= n ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
    ))}
  </div>
);

/* ─── Section Header ─── */
const SectionHeader = ({ badge, title, sub }) => (
  <div className="text-center mb-14">
    {badge && <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-4">{badge}</span>}
    <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
    {sub && <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base">{sub}</p>}
  </div>
);

/* ─── FAQ Item ─── */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
        <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm md:text-base">{q}</span>
        {open ? <ChevronUp size={18} className="text-primary-500 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
      </button>
      {open && <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</div>}
    </div>
  );
};

const FAQS = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 3–5 business days within the US. Express options (1–2 days) are available at checkout. International orders typically arrive within 7–14 business days.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy. If you\'re not satisfied, return the item in original condition for a full refund or exchange. Contact support@glowcare.com to initiate.' },
  { q: 'Are your products safe for sensitive skin?', a: 'Yes! All GlowCare products are dermatologist-tested, fragrance-free, and formulated for all skin types including sensitive. Always do a patch test before full use.' },
  { q: 'How do I find the right products for my skin type?', a: 'Use our Skin Type Filter on the Products page to browse recommendations. Our blog also has in-depth guides for oily, dry, combination, and sensitive skin.' },
  { q: 'Are GlowCare products cruelty-free and vegan?', a: 'Absolutely! Every product is 100% cruelty-free and most are fully vegan. Look for the vegan badge on individual product pages.' },
  { q: 'Can I track my order?', a: 'Yes! After placing your order you\'ll receive a tracking link via email. You can also view order status under My Orders in your profile.' },
];

const REVIEWS = [
  { name: 'Sofia M.', location: 'New York', rating: 5, text: 'The Vitamin C Serum completely transformed my skin! My dark spots faded in just 3 weeks and my complexion looks so bright.', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Priya K.', location: 'London', rating: 5, text: 'Finally found a moisturizer that doesn\'t break me out. My oily skin feels balanced all day. Absolutely love GlowCare!', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { name: 'Emma L.', location: 'Sydney', rating: 5, text: 'The Rose Hydra Mask is pure luxury. My skin feels like velvet after every use. Worth every penny!', img: 'https://randomuser.me/api/portraits/women/22.jpg' },
  { name: 'Jasmine T.', location: 'Toronto', rating: 4, text: 'Great natural ingredients, fast shipping, beautiful packaging. My go-to for skincare now. Highly recommend the serum!', img: 'https://randomuser.me/api/portraits/women/33.jpg' },
];

const SKIN_TYPES = [
  { type: 'Oily Skin', emoji: '💧', desc: 'Balance oil & minimize pores', color: 'from-blue-50 to-cyan-50', border: 'border-blue-200', tag: 'oily' },
  { type: 'Dry Skin', emoji: '🌸', desc: 'Deep hydration & nourishment', color: 'from-pink-50 to-rose-50', border: 'border-pink-200', tag: 'dry' },
  { type: 'Sensitive Skin', emoji: '🍃', desc: 'Gentle, calming formulas', color: 'from-green-50 to-emerald-50', border: 'border-green-200', tag: 'sensitive' },
  { type: 'Combination Skin', emoji: '✨', desc: 'Balance & unify your skin', color: 'from-purple-50 to-violet-50', border: 'border-purple-200', tag: 'combination' },
];

const WHY_CARDS = [
  { icon: Leaf, title: 'Natural Ingredients', desc: '100% plant-based, no harmful chemicals or synthetic fragrances.', color: 'bg-green-100 text-green-600' },
  { icon: Shield, title: 'Cruelty Free', desc: 'Never tested on animals. Certified by Leaping Bunny.', color: 'bg-pink-100 text-pink-600' },
  { icon: Award, title: 'Dermatologist Approved', desc: 'Clinically tested and recommended by leading skin experts.', color: 'bg-amber-100 text-amber-600' },
  { icon: Recycle, title: 'Eco Friendly', desc: 'Sustainable packaging — recyclable, biodegradable, and minimal waste.', color: 'bg-emerald-100 text-emerald-600' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    productService.getAllProducts({ limit: 8, sortBy: '-rating' })
      .then(res => setFeatured(res.data?.data || []))
      .catch(() => { });
  }, []);

  const handleContact = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setContactForm({ name: '', email: '', message: '' }); }, 1500);
  };

  return (
    <div className="min-h-screen">

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-20">
        {/* Blobs */}
        <div className="blob w-96 h-96 bg-primary-200 opacity-40 top-10 -left-20 animate-float" />
        <div className="blob w-72 h-72 bg-pink-200 opacity-30 bottom-10 right-10 animate-float" style={{ animationDelay: '2s' }} />
        <div className="blob w-48 h-48 bg-rose-300 opacity-25 top-1/2 left-1/2 animate-float" style={{ animationDelay: '1s' }} />

        <div className="container-xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft" />
                Natural • Cruelty-Free • Dermatologist Approved
              </div>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Your Skin<br />
                <span className="text-gradient">Deserves</span><br />
                The Best
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
                Discover premium natural skincare crafted to reveal your most radiant, healthy glow. Science-backed formulas, ethically sourced ingredients.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary text-base !px-8 !py-4 shadow-glow">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <a href="#about" className="btn-secondary text-base !px-8 !py-4">
                  Our Story
                </a>
              </div>
              {/* Stats */}
              <div className="flex gap-8 mt-10">
                {[['10K+', 'Happy Customers'], ['50+', 'Natural Products'], ['5★', 'Avg. Rating']].map(([num, label]) => (
                  <div key={label}>
                    <div className="font-heading text-2xl font-bold text-gradient">{num}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="animate-slide-left relative flex justify-center">
              <div className="relative w-80 h-80 md:w-[420px] md:h-[420px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-200 via-pink-100 to-rose-200 dark:from-primary-900/50 dark:to-pink-900/50 animate-pulse-soft" />
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80"
                  alt="GlowCare Premium Skincare"
                  className="relative z-10 w-full h-full object-cover rounded-full shadow-2xl animate-float"
                  style={{ animationDuration: '5s' }}
                />
                {/* Floating cards */}
                <div className="absolute -left-8 top-16 glass rounded-2xl px-4 py-3 shadow-card animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  <div className="text-xs text-gray-500 mb-0.5">Trusted by</div>
                  <div className="font-bold text-gray-800 text-sm">10,000+ Users</div>
                </div>
                <div className="absolute -right-8 bottom-16 glass rounded-2xl px-4 py-3 shadow-card animate-fade-up" style={{ animationDelay: '0.8s' }}>
                  <Stars n={5} />
                  <div className="font-bold text-gray-800 text-sm mt-1">5.0 Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FEATURED PRODUCTS ══════ */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container-xl">
          <SectionHeader badge="🌟 Bestsellers" title="Featured Products" sub="Our most-loved skincare essentials, chosen by thousands of happy customers." />
          {featured.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.slice(0, 8).map(p => (
                  <ProductCard key={p._id} product={p} onViewDetails={setSelectedProduct} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to="/products" className="btn-primary">View All Products <ArrowRight size={16} /></Link>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden">
                  <div className="skeleton h-56 w-full" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-4 w-2/3 rounded-full" />
                    <div className="skeleton h-4 w-full rounded-full" />
                    <div className="skeleton h-8 w-1/2 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════ SKIN TYPE ══════ */}
      <section className="section bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container-xl">
          <SectionHeader badge="💆 Find Your Match" title="Shop by Skin Type" sub="Every skin is unique. Discover products tailored specifically for your skin's needs." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKIN_TYPES.map(s => (
              <Link
                key={s.type}
                to={`/products?skinType=${s.tag}`}
                className={`group relative bg-gradient-to-br ${s.color} dark:from-gray-800 dark:to-gray-900 border ${s.border} dark:border-gray-700 rounded-3xl p-7 text-center hover:-translate-y-2 hover:shadow-card-hover transition-all duration-400`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{s.emoji}</div>
                <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-2">{s.type}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{s.desc}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-primary-600 dark:text-primary-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Now <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ WHY GLOWCARE ══════ */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container-xl">
          <SectionHeader badge="💎 Our Promise" title="Why Choose GlowCare?" sub="We believe great skincare should never compromise on quality, ethics, or the environment." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CARDS.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="group card p-8 text-center hover:border hover:border-primary-100">
                <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} />
                </div>
                <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ ABOUT US ══════ */}
      <section id="about" className="section bg-gradient-to-br from-primary-50 via-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <div className="relative animate-slide-right">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80" alt="GlowCare Story" className="w-full h-[480px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-5 shadow-card">
                <div className="text-sm font-semibold text-gray-800">Founded in 2020</div>
                <div className="text-xs text-gray-500 mt-1">Serving 10,000+ customers</div>
                <div className="flex gap-1 mt-2"><Stars n={5} /></div>
              </div>
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow animate-float">
                <span className="text-3xl">🌿</span>
              </div>
            </div>

            {/* Text */}
            <div className="animate-fade-up">
              <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-5">Our Story</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Skincare Born<br />
                <span className="text-gradient">from Passion</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-5">
                GlowCare was born from a simple belief — everyone deserves skincare that works. Founded in 2020, we set out to create premium natural products that deliver real results without harmful chemicals or animal testing.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-8">
                Our team of dermatologists, botanists, and skincare enthusiasts craft every formula with care. We source the finest natural ingredients globally, ensuring purity, potency, and sustainability in every bottle.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  ['🌱', '100% Natural', 'No synthetic fillers'],
                  ['🧪', 'Lab Tested', 'Clinically proven results'],
                  ['🐰', 'Cruelty Free', 'Never tested on animals'],
                  ['♻️', 'Eco Packaging', 'Zero waste commitment'],
                ].map(([icon, title, sub]) => (
                  <div key={title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</div>
                      <div className="text-xs text-gray-500">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/products" className="btn-primary">Explore Our Products <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ REVIEWS ══════ */}
      <section className="section bg-white dark:bg-gray-950">
        <div className="container-xl">
          <SectionHeader badge="💬 Testimonials" title="What Our Customers Say" sub="Real reviews from real people who have transformed their skin with GlowCare." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="card p-6 hover:border hover:border-primary-100 group">
                <div className="flex items-center justify-between mb-4">
                  <Stars n={r.rating} />
                  <Quote size={20} className="text-primary-200 group-hover:text-primary-400 transition-colors" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 italic">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.img} alt={r.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-200" />
                  <div>
                    <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section id="faq" className="section bg-gradient-to-br from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-lg">
          <SectionHeader badge="❓ FAQ" title="Frequently Asked Questions" sub="Everything you need to know about GlowCare products and services." />
          <div className="max-w-2xl mx-auto">
            {FAQS.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ══════ CONTACT ══════ */}
      <section id="contact" className="section bg-white dark:bg-gray-950">
        <div className="container-xl">
          <SectionHeader badge="📬 Get In Touch" title="Contact Us" sub="Have a question or need help? We'd love to hear from you." />
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Info */}
            <div>
              <div className="space-y-5 mb-8">
                {[
                  { Icon: Mail, title: 'Email', val: 'hello@glowcare.com', href: 'mailto:hello@glowcare.com' },
                  { Icon: Phone, title: 'Phone', val: '+1 (555) 123-4567', href: 'tel:+15551234567' },
                  { Icon: MapPin, title: 'Location', val: 'New York, NY 10001', href: '#' },
                ].map(({ Icon, title, val, href }) => (
                  <a key={title} href={href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                      <Icon size={20} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{title}</div>
                      <div className="text-gray-800 dark:text-gray-200 font-semibold">{val}</div>
                    </div>
                  </a>
                ))}
              </div>
              {/* Map placeholder */}
              <div className="rounded-2xl overflow-hidden h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-primary-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">New York, NY 10001</p>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-xs text-primary-500 hover:underline mt-1 block">View on Google Maps →</a>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleContact} className="card p-8">
              <h3 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name</label>
                  <input type="text" required value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Jane Doe" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <input type="email" required value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} placeholder="jane@email.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                  <textarea required rows={5} value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} placeholder="How can we help you?" className="input-field resize-none" />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center !py-4">
                  <Send size={16} /> {sending ? 'Sending…' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
