import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { register, isAuthenticated, error, setError, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setLocalError('Por favor completa todos los campos.');
      return;
    }

    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-400 text-white shadow-lg glow-primary mb-3">
            <User className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Mini-OMS</h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">Crea una nueva cuenta</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative">
          <h2 className="text-xl font-bold text-white mb-6">Registro</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {activeError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold animate-fade-in">
                {activeError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre Completo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@example.com"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-12 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-600 hover:to-sky-700 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/15 active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Crear Cuenta</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/5 pt-5">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
