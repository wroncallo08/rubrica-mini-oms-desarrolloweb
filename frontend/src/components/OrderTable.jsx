import React from 'react';
import { Package } from 'lucide-react';

const statusStyles = {
  'Pendiente': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'En Progreso': 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  'Completado': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Cancelado': 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
};

export const OrderTable = ({ orders, loading, onStatusChange }) => {
  if (loading) {
    return (
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 animate-pulse shadow-2xl">
        <div className="p-6 bg-slate-900/30 border-b border-white/5">
          <div className="h-5 w-48 bg-slate-800 rounded-md"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex space-x-4 items-center py-2">
              <div className="w-12 h-6 bg-slate-800 rounded"></div>
              <div className="flex-1 h-6 bg-slate-800 rounded"></div>
              <div className="w-24 h-6 bg-slate-800 rounded"></div>
              <div className="w-32 h-6 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center border border-white/5 flex flex-col items-center justify-center space-y-4 shadow-xl">
        <div className="p-4 rounded-full bg-slate-900/50 text-slate-400 border border-white/5 glow-primary">
          <Package className="h-8 w-8 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-lg text-white">No hay pedidos registrados</h4>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">Comienza agregando un nuevo pedido al sistema presionando el botón superior.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-2xl animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 border-b border-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Cliente</th>
              <th className="py-4 px-6">Producto</th>
              <th className="py-4 px-6 text-center">Cant.</th>
              <th className="py-4 px-6 text-right">Precio Unit.</th>
              <th className="py-4 px-6 text-right">Total</th>
              <th className="py-4 px-6 text-center">Estado</th>
              <th className="py-4 px-6 text-right">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-slate-300">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-900/30 transition-colors group">
                <td className="py-4.5 px-6 font-mono text-xs text-primary-400 font-bold">#{order.id}</td>
                <td className="py-4.5 px-6 font-semibold text-white">{order.clientName}</td>
                <td className="py-4.5 px-6 text-slate-300">{order.product}</td>
                <td className="py-4.5 px-6 text-center font-medium">{order.quantity}</td>
                <td className="py-4.5 px-6 text-right font-mono">${Number(order.unitPrice).toFixed(2)}</td>
                <td className="py-4.5 px-6 text-right font-mono font-bold text-white">${Number(order.totalPrice).toFixed(2)}</td>
                <td className="py-4.5 px-6 text-center">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange && onStatusChange(order.id, e.target.value)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[order.status]} bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer transition-all hover:bg-slate-850/80`}
                  >
                    <option value="Pendiente" className="bg-slate-950 text-amber-400 font-medium">Pendiente</option>
                    <option value="En Progreso" className="bg-slate-950 text-sky-400 font-medium">En Progreso</option>
                    <option value="Completado" className="bg-slate-950 text-emerald-400 font-medium">Completado</option>
                    <option value="Cancelado" className="bg-slate-950 text-rose-400 font-medium">Cancelado</option>
                  </select>
                </td>
                <td className="py-4.5 px-6 text-right text-xs text-slate-400 font-medium">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
