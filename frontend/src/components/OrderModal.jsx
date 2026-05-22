import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus } from 'lucide-react';

export const OrderModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [clientName, setClientName] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0.0);
  const [status, setStatus] = useState('Pendiente');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setClientName('');
      setProduct('');
      setQuantity(1);
      setUnitPrice(0.0);
      setStatus('Pendiente');
      setFormError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!clientName.trim()) return setFormError('El nombre del cliente es obligatorio');
    if (!product.trim()) return setFormError('El nombre del producto es obligatorio');
    if (quantity <= 0) return setFormError('La cantidad debe ser mayor a 0');
    if (unitPrice < 0) return setFormError('El precio unitario no puede ser negativo');

    try {
      await onSubmit({
        clientName: clientName.trim(),
        product: product.trim(),
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        status
      });
      onClose();
    } catch (err) {
      setFormError(err.message || 'Error al guardar el pedido');
    }
  };

  const calculatedTotal = (parseInt(quantity) || 0) * (parseFloat(unitPrice) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative glass-panel rounded-3xl w-full max-w-lg overflow-hidden border border-white/10 shadow-2xl animate-fade-in z-10 glow-primary">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400 border border-primary-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Nuevo Pedido</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-white/5 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
              {formError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Cliente</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Producto</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ej. Laptop Dell XPS 15"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Cantidad</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Precio Unitario ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Estado del Pedido</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition-all"
            >
              <option value="Pendiente" className="bg-slate-950">Pendiente</option>
              <option value="En Progreso" className="bg-slate-950">En Progreso</option>
              <option value="Completado" className="bg-slate-950">Completado</option>
              <option value="Cancelado" className="bg-slate-950">Cancelado</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Estimado</span>
            <span className="text-xl font-extrabold text-primary-400 font-mono">${calculatedTotal.toFixed(2)}</span>
          </div>

          <div className="pt-2 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-white/10 text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-800/40 hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-primary-500 to-sky-600 hover:from-primary-600 hover:to-sky-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Crear Pedido</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
