import { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders debe utilizarse dentro de un OrderProvider');
  }
  return context;
};

export default useOrders;
