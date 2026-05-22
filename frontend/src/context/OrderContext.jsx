import React, { createContext, useState, useCallback } from 'react';
import orderService from '../services/orderService';

export const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = async (orderData) => {
    setError(null);
    try {
      const newOrder = await orderService.createOrder(orderData);
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      return newOrder;
    } catch (err) {
      setError(err.message || 'Error al crear el pedido');
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setError(null);
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === orderId ? updatedOrder : o))
      );
      return updatedOrder;
    } catch (err) {
      setError(err.message || 'Error al actualizar el estado del pedido');
      throw err;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, loading, error, fetchOrders, createOrder, updateOrderStatus, setError }}>
      {children}
    </OrderContext.Provider>
  );
};
export default OrderProvider;
