import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Shield, LayoutDashboard, Package, ShoppingCart, Settings, Ban, CheckCircle } from 'lucide-react';

const MOCK_USERS = [
  { _id:'1', name:'Sofia Martinez', email:'sofia@email.com', role:'user', createdAt:'2024-01-15', orders:5, status:'active' },
  { _id:'2', name:'Priya Kumar', email:'priya@email.com', role:'user', createdAt:'2024-02-03', orders:3, status:'active' },
  { _id:'3', name:'Admin User', email:'admin@glowcare.com', role:'admin', createdAt:'2024-01-01', orders:0, status:'active' },
  { _id:'4', name:'Emma Liu', email:'emma@email.com', role:'user', createdAt:'2024-03-22', orders:8, status:'active' },
  { _id:'5', name:'Jasmine Torres', email:'jas@email.com', role:'user', createdAt:'2024-04-10', orders:2, status:'inactive' },
];

const Sidebar = () => (
  <aside className="hidden lg:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen flex-col pt-8 px-4 sticky top-16">
    <div className="mb-8 px-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Panel</span></div>
    {[
      { label:'Dashboard', icon: LayoutDashboard, href:'/admin/dashboard' },
      { label:'Products', icon: Package, href:'/admin/products' },
      { label:'Orders', icon: ShoppingCart, href:'/admin/orders' },
      { label:'Users', icon: Users, href:'/admin/users', active:true },
      { label:'Settings', icon: Settings, href:'/admin/settings' },
    ].map(({ label, icon: Icon, href, active }) => (
      <Link key={href} to={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${active?'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400':'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600'}`}>
        <Icon size={18} />{label}
      </Link>
    ))}
  </aside>
);

export default function ManageUsers() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u._id === id ? { ...u, status: u.status==='active'?'inactive':'active' } : u));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
            <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              ['Total', users.length, 'bg-blue-100 text-blue-600'],
              ['Active', users.filter(u=>u.status==='active').length, 'bg-green-100 text-green-600'],
              ['Admins', users.filter(u=>u.role==='admin').length, 'bg-amber-100 text-amber-600'],
              ['Inactive', users.filter(u=>u.status==='inactive').length, 'bg-red-100 text-red-600'],
            ].map(([l,v,c]) => (
              <div key={l} className="card p-5 text-center">
                <div className="font-heading text-2xl font-bold text-gray-900 dark:text-white">{v}</div>
                <div className="text-xs text-gray-500 mt-1">{l} Users</div>
              </div>
            ))}
          </div>

          <div className="relative mb-5 max-w-xs">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users…" className="input-field pl-10" />
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                    {['User','Role','Orders','Joined','Status','Action'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filtered.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {u.name[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-200">{u.name}</div>
                            <div className="text-xs text-gray-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${u.role==='admin'?'bg-amber-100 text-amber-700':'badge-primary'} capitalize`}>
                          {u.role==='admin' && <Shield size={10} />} {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{u.orders}</td>
                      <td className="px-5 py-4 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${u.status==='active'?'badge-success':'badge-danger'} flex items-center gap-1 w-fit`}>
                          {u.status==='active'?<CheckCircle size={10}/>:<Ban size={10}/>} {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {u.role !== 'admin' && (
                          <button onClick={() => toggleStatus(u._id)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${u.status==='active'?'text-red-500 hover:bg-red-50':'text-green-600 hover:bg-green-50'}`}>
                            {u.status==='active'?'Deactivate':'Activate'}
                          </button>
                        )}
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
