import api from './api';

export const orderService = {
  getOrders: async () => {
    return api.get('/orders');
  },

  createOrder: async (orderData) => {
    return api.post('/orders', orderData);
  },

  updateOrderStatus: async (orderId, newStatus) => {
    return api.patch(`/orders/${orderId}/status`, { status: newStatus });
  }
};

export default orderService;
