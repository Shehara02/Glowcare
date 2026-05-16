import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Package, X, Save, Upload, LayoutDashboard, ShoppingCart, Users, Settings } from 'lucide-react';
import { productService } from '../../services/productService';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['cleanser','serum','moisturizer','mask','sunscreen','other'];
const SKIN_TYPES = ['oily','dry','sensitive','all'];

const EMPTY_FORM = { name:'', description:'', category:'cleanser', skinType:['all'], price:'', stock:'', image:'', ingredients:'', usage:'', isBestSeller:false };

const Sidebar = () => (
  <aside className="hidden lg:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen flex-col pt-8 px-4 sticky top-16">
    <div className="mb-8 px-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Panel</span></div>
    {[
      { label:'Dashboard', icon: LayoutDashboard, href:'/admin/dashboard' },
      { label:'Products', icon: Package, href:'/admin/products', active:true },
      { label:'Orders', icon: ShoppingCart, href:'/admin/orders' },
      { label:'Users', icon: Users, href:'/admin/users' },
      { label:'Settings', icon: Settings, href:'/admin/settings' },
    ].map(({ label, icon: Icon, href, active }) => (
      <Link key={href} to={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${active?'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400':'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600'}`}>
        <Icon size={18} />{label}
      </Link>
    ))}
  </aside>
);

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getAllProducts({ limit: 100 });
      setProducts(res.data?.data || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name||'', description: p.description||'', category: p.category||'cleanser',
      skinType: p.skinType||['all'], price: p.price||'', stock: p.stock||'',
      image: p.image||'', ingredients: (p.ingredients||[]).join(', '), usage: p.usage||'', isBestSeller: p.isBestSeller||false,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: +form.price, stock: +form.stock,
        ingredients: form.ingredients.split(',').map(s=>s.trim()).filter(Boolean),
      };
      if (editProduct) {
        await productService.updateProduct(editProduct._id, payload);
        toast.success('Product updated! ✨');
      } else {
        await productService.createProduct(payload);
        toast.success('Product created! 🌸');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">Manage Products</h1>
              <p className="text-gray-500 text-sm mt-1">{products.length} products total</p>
            </div>
            <button onClick={openCreate} className="btn-primary !px-5 !py-2.5 text-sm">
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-5 max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…" className="input-field pl-10" />
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                      {['Product','Category','Price','Stock','Status','Actions'].map(h => (
                        <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-gray-400">No products found</td></tr>
                    ) : filtered.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                              <img src={p.image||'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&q=60'} alt="" className="w-full h-full object-cover" onError={e=>{e.target.style.display='none';}} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{p.name}</p>
                              <p className="text-xs text-gray-400">{p.skinType?.join(', ')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="badge badge-primary capitalize text-xs">{p.category}</span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-primary-600">${p.price?.toFixed(2)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`font-semibold text-xs ${p.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>{p.stock}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`badge text-xs ${p.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                            {p.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(p)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-500 transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(p._id)} disabled={deleting===p._id}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                              {deleting===p._id ? <Spinner size="sm" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-7 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-7 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Product Name *</label>
                  <input required value={form.name} onChange={e=>setF('name',e.target.value)} placeholder="e.g. Vitamin C Brightening Serum" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Category *</label>
                  <select required value={form.category} onChange={e=>setF('category',e.target.value)} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Skin Type *</label>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_TYPES.map(s => (
                      <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={form.skinType.includes(s)} onChange={e => setF('skinType', e.target.checked ? [...form.skinType,s] : form.skinType.filter(t=>t!==s))} className="accent-primary-500" />
                        <span className="text-xs capitalize text-gray-700 dark:text-gray-300">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Price ($) *</label>
                  <input required type="number" min={0} step={0.01} value={form.price} onChange={e=>setF('price',e.target.value)} placeholder="29.99" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Stock *</label>
                  <input required type="number" min={0} value={form.stock} onChange={e=>setF('stock',e.target.value)} placeholder="50" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Image URL</label>
                  <div className="relative">
                    <Upload size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={form.image} onChange={e=>setF('image',e.target.value)} placeholder="https://example.com/image.jpg" className="input-field pl-9" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Description *</label>
                  <textarea required rows={3} value={form.description} onChange={e=>setF('description',e.target.value)} placeholder="Describe the product…" className="input-field resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Ingredients (comma separated)</label>
                  <input value={form.ingredients} onChange={e=>setF('ingredients',e.target.value)} placeholder="Vitamin C, Hyaluronic Acid, Niacinamide" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Usage Instructions</label>
                  <textarea rows={2} value={form.usage} onChange={e=>setF('usage',e.target.value)} placeholder="Apply 2-3 drops to cleansed skin…" className="input-field resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.isBestSeller} onChange={e=>setF('isBestSeller',e.target.checked)} className="w-4 h-4 accent-primary-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Bestseller ⭐</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary !px-6 !py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary !px-8 !py-2.5 text-sm">
                  {saving ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</span> : <><Save size={15} />{editProduct?'Update':'Create'} Product</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
