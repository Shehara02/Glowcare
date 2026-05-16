import api from './api';

export const orderService = {
  // Create order
  createOrder: (data) => {
    return api.post('/orders', data);
  },

  // Get user orders
  getUserOrders: (params = {}) => {
    return api.get('/orders/my-orders', { params });
  },

  // Get order details
  getOrder: (id) => {
    return api.get(`/orders/${id}`);
  },

  // Cancel order
  cancelOrder: (id) => {
    return api.put(`/orders/${id}/cancel`);
  },

  // Admin: Get all orders
  getAllOrders: (params = {}) => {
    return api.get('/orders', { params });
  },

  // Admin: Update order status
  updateOrderStatus: (id, data) => {
    return api.put(`/orders/${id}/status`, data);
  }
};
