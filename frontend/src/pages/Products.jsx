import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, LayoutGrid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Spinner from '../components/Spinner';
import { productService } from '../services/productService';

const CATEGORIES = ['all','cleanser','serum','moisturizer','mask','sunscreen','other'];
const SKIN_TYPES = ['all','oily','dry','sensitive','combination'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price',     label: 'Price: Low to High' },
  { value: '-price',    label: 'Price: High to Low' },
  { value: '-rating',   label: 'Top Rated' },
  { value: '-numReviews', label: 'Most Popular' },
];

const Products = () => {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [total, setTotal]             = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode]       = useState('grid');

  const [filters, setFilters] = useState({
    search: '', category: 'all', skinType: 'all',
    sortBy: '-createdAt', minPrice: 0, maxPrice: 200,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search)              params.search   = filters.search;
      if (filters.category !== 'all')  params.category = filters.category;
      if (filters.skinType !== 'all')  params.skinType = filters.skinType;
      if (filters.sortBy)              params.sortBy   = filters.sortBy;
      params.minPrice = filters.minPrice;
      params.maxPrice = filters.maxPrice;
      const res = await productService.getAllProducts(params);
      setProducts(res.data?.data || []);
      setTotal(res.data?.total || res.data?.data?.length || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const skin = params.get('skinType');
    if (cat || skin) setFilters(prev => ({ ...prev, ...(cat && {category: cat}), ...(skin && {skinType: skin}) }));
  }, []);

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const clearFilters = () => setFilters({ search:'', category:'all', skinType:'all', sortBy:'-createdAt', minPrice:0, maxPrice:200 });

  const hasActiveFilters = filters.category !== 'all' || filters.skinType !== 'all' || filters.search || filters.minPrice > 0 || filters.maxPrice < 200;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-pink-400 py-14">
        <div className="container-xl text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs font-semibold rounded-full mb-3">Our Collection</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">All Products</h1>
          <p className="text-white/80 text-base max-w-md mx-auto">Premium skincare for every skin type — natural, effective, and ethically made.</p>
        </div>
      </div>

      <div className="container-xl py-8">
        {/* ─ Top Controls ─ */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search skincare products…"
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              className="input-field pl-11"
            />
            {filters.search && (
              <button onClick={() => setFilter('search','')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative min-w-[180px]">
            <select
              value={filters.sortBy}
              onChange={e => setFilter('sortBy', e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${showFilters || hasActiveFilters ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300'}`}
          >
            <SlidersHorizontal size={16} />
            Filters {hasActiveFilters && <span className="w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">!</span>}
          </button>

          {/* View mode */}
          <div className="hidden md:flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-3 transition-colors ${viewMode==='grid'?'bg-primary-50 text-primary-600 dark:bg-primary-900/20':'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`p-3 transition-colors ${viewMode==='list'?'bg-primary-50 text-primary-600 dark:bg-primary-900/20':'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}><List size={16} /></button>
          </div>
        </div>

        {/* ─ Filter Panel ─ */}
        {showFilters && (
          <div className="card p-6 mb-6 animate-fade-down">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Filter Products</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-primary-500 hover:text-primary-700 font-medium flex items-center gap-1">
                  <X size={14} /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setFilter('category',c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filters.category===c?'bg-primary-500 text-white shadow-glow':'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600'}`}>
                      {c==='all'?'All':c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skin Type</label>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TYPES.map(s => (
                    <button key={s} onClick={() => setFilter('skinType',s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filters.skinType===s?'bg-primary-500 text-white shadow-glow':'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600'}`}>
                      {s==='all'?'All':s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Price Range: <span className="text-primary-600">${filters.minPrice} – ${filters.maxPrice}</span>
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min={0} max={200} value={filters.minPrice}
                    onChange={e => setFilter('minPrice', +e.target.value)}
                    className="flex-1 accent-primary-500" />
                  <span className="text-xs text-gray-400">to</span>
                  <input type="range" min={0} max={200} value={filters.maxPrice}
                    onChange={e => setFilter('maxPrice', +e.target.value)}
                    className="flex-1 accent-primary-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─ Results count ─ */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {loading ? 'Loading…' : `${products.length} products found`}
            {hasActiveFilters && ' (filtered)'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-primary-500 hover:underline flex items-center gap-1">
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* ─ Grid / List ─ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" />
            <p className="text-gray-400 text-sm">Loading products…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-heading text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <ProductCard key={p._id} product={p} onViewDetails={setSelectedProduct} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {products.map(p => (
              <div key={p._id} className="card p-5 flex gap-5 cursor-pointer hover:border hover:border-primary-100" onClick={() => setSelectedProduct(p)}>
                <img src={p.image||'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=70'} alt={p.name}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0" onError={e=>{e.target.src='https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=70';}} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="badge badge-primary text-[10px] mb-1">{p.category}</span>
                      <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{p.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{p.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold text-primary-600 dark:text-primary-400">${p.price?.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default Products;
