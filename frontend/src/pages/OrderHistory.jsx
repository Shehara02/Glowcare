import React, { useState } from 'react';
import { Package, ChevronDown, ChevronUp, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

const MOCK_ORDERS = [
  { id:'GC-2024-001', date:'2024-03-15', status:'delivered', total:89.97, items:[
    { name:'Vitamin C Brightening Serum', qty:1, price:45.99, img:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=70' },
    { name:'Rose Hydra Mask', qty:2, price:21.99, img:'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&q=70' },
  ]},
  { id:'GC-2024-002', date:'2024-04-02', status:'shipped', total:54.99, items:[
    { name:'Gentle Foaming Cleanser', qty:1, price:28.99, img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&q=70' },
    { name:'SPF 50 Daily Sunscreen', qty:1, price:26.00, img:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=70' },
  ]},
  { id:'GC-2024-003', date:'2024-05-10', status:'processing', total:38.50, items:[
    { name:'Niacinamide Pore Serum', qty:1, price:38.50, img:'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&q=70' },
  ]},
];

const STATUS = {
  delivered:  { label:'Delivered',   icon: CheckCircle, color:'text-green-600 bg-green-100' },
  shipped:    { label:'Shipped',      icon: Truck,        color:'text-blue-600 bg-blue-100' },
  processing: { label:'Processing',  icon: Clock,        color:'text-amber-600 bg-amber-100' },
  cancelled:  { label:'Cancelled',   icon: XCircle,      color:'text-red-600 bg-red-100' },
};

const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);
  const status = STATUS[order.status];

  return (
    <div className="card overflow-hidden animate-fade-up">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{order.id}</h3>
            <span className={`badge text-xs ${status.color}`}>
              <status.icon size={11} /> {status.label}
            </span>
          </div>
          <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-lg font-bold text-primary-600 dark:text-primary-400">${order.total.toFixed(2)}</div>
            <div className="text-xs text-gray-400">{order.items.length} item{order.items.length!==1?'s':''}</div>
          </div>
          <button onClick={() => setOpen(!open)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-900/50 animate-fade-down space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <img src={item.img} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" onError={e=>{e.target.src='https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=70';}} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
              </div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">${(item.price*item.qty).toFixed(2)}</p>
            </div>
          ))}
          {order.status === 'delivered' && (
            <button className="mt-2 text-xs text-primary-500 hover:underline font-medium">Write a review →</button>
          )}
        </div>
      )}
    </div>
  );
};

export default function OrderHistory() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="container-xl max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center">
            <Package size={24} className="text-primary-600" />
          </div>
          <div>
            <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-white">My Orders</h1>
            <p className="text-gray-500 mt-0.5">{MOCK_ORDERS.length} orders placed</p>
          </div>
        </div>

        {MOCK_ORDERS.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="font-heading text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_ORDERS.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
