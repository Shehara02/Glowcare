import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Eye, LayoutDashboard, Package, Users, Settings, ChevronDown } from 'lucide-react';

const MOCK_ORDERS = [
  { id:'GC-2024-091', customer:'Sofia Martinez', email:'sofia@email.com', items:3, amount:89.97, status:'delivered', date:'2024-05-01' },
  { id:'GC-2024-090', customer:'Priya Kumar', email:'priya@email.com', items:1, amount:21.99, status:'shipped', date:'2024-05-03' },
  { id:'GC-2024-089', customer:'Emma Liu', email:'emma@email.com', items:2, amount:63.98, status:'processing', date:'2024-05-08' },
  { id:'GC-2024-088', customer:'Jasmine Torres', email:'jas@email.com', items:4, amount:134.96, status:'delivered', date:'2024-05-10' },
  { id:'GC-2024-087', customer:'Aisha Khan', email:'aisha@email.com', items:1, amount:38.50, status:'cancelled', date:'2024-05-12' },
  { id:'GC-2024-086', customer:'Mei Zhang', email:'mei@email.com', items:2, amount:72.48, status:'shipped', date:'2024-05-13' },
];

const STATUS_STYLES = {
  delivered: 'bg-green-100 text-green-700',
  shipped:   'bg-blue-100 text-blue-700',
  processing:'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Sidebar = () => (
  <aside className="hidden lg:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen flex-col pt-8 px-4 sticky top-16">
    <div className="mb-8 px-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Panel</span></div>
    {[
      { label:'Dashboard', icon: LayoutDashboard, href:'/admin/dashboard' },
      { label:'Products', icon: Package, href:'/admin/products' },
      { label:'Orders', icon: ShoppingCart, href:'/admin/orders', active:true },
      { label:'Users', icon: Users, href:'/admin/users' },
      { label:'Settings', icon: Settings, href:'/admin/settings' },
    ].map(({ label, icon: Icon, href, active }) => (
      <Link key={href} to={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${active?'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400':'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600'}`}>
        <Icon size={18} />{label}
      </Link>
    ))}
  </aside>
);

export default function ManageOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = orders.filter(o =>
    (statusFilter === 'all' || o.status === statusFilter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const STATUSES = ['all','delivered','shipped','processing','cancelled'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">Manage Orders</h1>
            <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders…" className="input-field pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${statusFilter===s?'bg-primary-500 text-white shadow-glow':'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                    {['Order ID','Customer','Items','Amount','Status','Date','Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">No orders found</td></tr>
                  ) : filtered.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">{order.id}</td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{order.customer}</div>
                        <div className="text-xs text-gray-400">{order.email}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{order.items} items</td>
                      <td className="px-5 py-4 font-bold text-primary-600">${order.amount.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            className={`badge text-xs pr-6 cursor-pointer appearance-none border-0 outline-none font-semibold ${STATUS_STYLES[order.status]}`}
                          >
                            {['processing','shipped','delivered','cancelled'].map(s => (
                              <option key={s} value={s} className="capitalize bg-white text-gray-800">{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-500 transition-colors">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
