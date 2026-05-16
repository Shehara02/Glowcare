import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Users, ShoppingCart, DollarSign, TrendingUp, Plus,
  ArrowUpRight, Eye, MoreHorizontal, LayoutDashboard, Settings
} from 'lucide-react';
import { productService } from '../../services/productService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const REVENUE_DATA = [
  { month:'Jan', revenue:4200 }, { month:'Feb', revenue:5800 }, { month:'Mar', revenue:4900 },
  { month:'Apr', revenue:7200 }, { month:'May', revenue:6500 }, { month:'Jun', revenue:8900 },
  { month:'Jul', revenue:9200 }, { month:'Aug', revenue:7800 }, { month:'Sep', revenue:10400 },
  { month:'Oct', revenue:9800 }, { month:'Nov', revenue:12100 }, { month:'Dec', revenue:14500 },
];

const RECENT_ORDERS = [
  { id:'GC-2024-091', customer:'Sofia Martinez', product:'Vitamin C Serum', amount:45.99, status:'delivered' },
  { id:'GC-2024-090', customer:'Priya Kumar', product:'Rose Hydra Mask', amount:21.99, status:'shipped' },
  { id:'GC-2024-089', customer:'Emma Liu', product:'Gentle Cleanser', amount:28.99, status:'processing' },
  { id:'GC-2024-088', customer:'Jasmine Torres', product:'SPF 50 Sunscreen', amount:34.99, status:'delivered' },
  { id:'GC-2024-087', customer:'Aisha Khan', product:'Niacinamide Serum', amount:38.50, status:'cancelled' },
];

const STATUS_COLORS = {
  delivered: 'bg-green-100 text-green-700',
  shipped:   'bg-blue-100 text-blue-700',
  processing:'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
};

const StatCard = ({ icon: Icon, label, value, change, color, href }) => (
  <Link to={href || '#'} className="card p-6 hover:border hover:border-primary-100 group block">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon size={22} />
      </div>
      <ArrowUpRight size={16} className="text-gray-300 group-hover:text-primary-400 transition-colors" />
    </div>
    <div className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{label}</div>
    {change && (
      <div className="flex items-center gap-1 text-xs">
        <TrendingUp size={12} className="text-green-500" />
        <span className="text-green-600 font-semibold">{change}</span>
        <span className="text-gray-400">vs last month</span>
      </div>
    )}
  </Link>
);

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    productService.getAllProducts({ limit: 5, sortBy: '-createdAt' })
      .then(res => {
        setProducts(res.data?.data || []);
        setProductCount(res.data?.total || res.data?.data?.length || 0);
      }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen flex-col pt-8 px-4 sticky top-16">
          <div className="mb-8 px-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Panel</span>
          </div>
          {[
            { label:'Dashboard', icon: LayoutDashboard, href:'/admin/dashboard', active:true },
            { label:'Products', icon: Package, href:'/admin/products' },
            { label:'Orders', icon: ShoppingCart, href:'/admin/orders' },
            { label:'Users', icon: Users, href:'/admin/users' },
            { label:'Settings', icon: Settings, href:'/admin/settings' },
          ].map(({ label, icon: Icon, href, active }) => (
            <Link key={href} to={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${
                active ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600'
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, Admin 👋</p>
            </div>
            <Link to="/admin/products" className="btn-primary !px-5 !py-2.5 text-sm">
              <Plus size={16} /> Add Product
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <StatCard icon={DollarSign} label="Total Revenue" value="$48,295" change="+18.2%" color="bg-green-100 text-green-600" />
            <StatCard icon={Package} label="Total Products" value={productCount || 24} change="+3 new" color="bg-primary-100 text-primary-600" href="/admin/products" />
            <StatCard icon={ShoppingCart} label="Total Orders" value="1,284" change="+12.5%" color="bg-blue-100 text-blue-600" href="/admin/orders" />
            <StatCard icon={Users} label="Total Users" value="3,842" change="+8.1%" color="bg-amber-100 text-amber-600" href="/admin/users" />
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-lg font-bold text-gray-800 dark:text-white">Revenue Overview</h3>
                <span className="badge badge-success text-xs">+18.2% this year</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={REVENUE_DATA} margin={{ top:0, right:0, left:-20, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:'#9ca3af' }} />
                  <YAxis tick={{ fontSize:11, fill:'#9ca3af' }} />
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="revenue" fill="#e8699a" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Categories */}
            <div className="card p-6">
              <h3 className="font-heading text-lg font-bold text-gray-800 dark:text-white mb-5">Top Categories</h3>
              <div className="space-y-4">
                {[
                  { label:'Serums', pct:38, color:'bg-primary-500' },
                  { label:'Moisturizers', pct:26, color:'bg-blue-500' },
                  { label:'Cleansers', pct:18, color:'bg-green-500' },
                  { label:'Masks', pct:12, color:'bg-amber-500' },
                  { label:'Sunscreen', pct:6, color:'bg-purple-500' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
                      <span className="text-gray-800 dark:text-gray-200 font-bold">{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <div className={`h-2 ${color} rounded-full transition-all duration-700`} style={{ width:`${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders + Recent Products */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-heading text-base font-bold text-gray-800 dark:text-white">Recent Orders</h3>
                <Link to="/admin/orders" className="text-xs text-primary-500 hover:underline font-medium">View all →</Link>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {RECENT_ORDERS.map(o => (
                  <div key={o.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                      <ShoppingCart size={15} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{o.customer}</p>
                      <p className="text-xs text-gray-400 truncate">{o.product}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">${o.amount}</p>
                      <span className={`badge text-[10px] ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Products */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-heading text-base font-bold text-gray-800 dark:text-white">Recent Products</h3>
                <Link to="/admin/products" className="text-xs text-primary-500 hover:underline font-medium">View all →</Link>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {(products.length > 0 ? products : [
                  { _id:'1', name:'Vitamin C Serum', category:'serum', price:45.99, stock:23 },
                  { _id:'2', name:'Rose Hydra Mask', category:'mask', price:21.99, stock:15 },
                  { _id:'3', name:'Gentle Cleanser', category:'cleanser', price:28.99, stock:40 },
                  { _id:'4', name:'SPF 50 Sunscreen', category:'sunscreen', price:34.99, stock:8 },
                  { _id:'5', name:'Niacinamide Serum', category:'serum', price:38.50, stock:31 },
                ]).slice(0,5).map(p => (
                  <div key={p._id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                      {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <Package size={15} className="text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">${p.price?.toFixed(2)}</p>
                      <p className={`text-[10px] font-medium ${p.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                        {p.stock} in stock
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
