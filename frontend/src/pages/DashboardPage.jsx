import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { MetricsCard } from '../components/MetricsCard';
import { OrderTable } from '../components/OrderTable';
import { OrderModal } from '../components/OrderModal';
import { LogOut, Plus, Package, Clock, Activity, CheckCircle, User } from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { orders, loading, error, fetchOrders, createOrder, updateOrderStatus } = useOrders();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pendiente').length;
  const inProgressOrders = orders.filter(o => o.status === 'En Progreso').length;
  const completedOrders = orders.filter(o => o.status === 'Completado').length;

  const handleCreateOrder = async (orderData) => {
    setIsSubmitting(true);
    try {
      await createOrder(orderData);
      setIsModalOpen(false);
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-md border-b border-white/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/15 font-bold text-lg leading-none">
              OMS
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">Mini-OMS</h1>
              <span className="text-[10px] font-medium text-slate-400">Order Management System</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2.5 bg-slate-900/50 px-3.5 py-1.5 rounded-xl border border-white/5">
              <div className="p-1 rounded-full bg-slate-800 text-slate-300">
                <User className="h-4 w-4" />
              </div>
              <div className="text-left leading-none">
                <p className="text-xs font-semibold text-white">{user?.name || 'Administrador'}</p>
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">{user?.role || 'admin'}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 active:scale-95 transition-all flex items-center space-x-1.5 text-xs font-medium"
              title="Cerrar sesión"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Panel de Control</h2>
            <p className="text-sm text-slate-400 mt-1">Supervisión en tiempo real de los pedidos y estados de entrega.</p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-center py-2.5 px-5 bg-gradient-to-r from-primary-500 to-sky-600 hover:from-primary-600 hover:to-sky-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/15 hover:shadow-primary-500/25 active:scale-[0.98] transition-all flex items-center space-x-2 animate-fade-in glow-primary"
          >
            <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
            <span>Nuevo Pedido</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm font-semibold flex items-center justify-between animate-fade-in">
            <span>{error}</span>
            <button onClick={fetchOrders} className="text-xs underline hover:text-white transition-colors">Reintentar</button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Total Pedidos"
            value={totalOrders}
            icon={Package}
            colorClass="text-primary-400 bg-primary-500"
            description="Pedidos registrados"
          />
          <MetricsCard
            title="Pendientes"
            value={pendingOrders}
            icon={Clock}
            colorClass="text-amber-400 bg-amber-500"
            description="Esperando procesamiento"
          />
          <MetricsCard
            title="En Progreso"
            value={inProgressOrders}
            icon={Activity}
            colorClass="text-sky-400 bg-sky-500"
            description="Pedidos en preparación"
          />
          <MetricsCard
            title="Completados"
            value={completedOrders}
            icon={CheckCircle}
            colorClass="text-emerald-400 bg-emerald-500"
            description="Entregas finalizadas"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">Listado de Pedidos</h3>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Actualizar Tabla'}
            </button>
          </div>
          
          <OrderTable orders={orders} loading={loading} onStatusChange={updateOrderStatus} />
        </div>
      </main>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrder}
        loading={isSubmitting}
      />
    </div>
  );
};

export default DashboardPage;
