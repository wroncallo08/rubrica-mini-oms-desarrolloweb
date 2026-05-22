import React from 'react';

export const MetricsCard = ({ title, value, icon: Icon, colorClass, description }) => {
  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
      <div className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <h3 className="text-3xl font-extrabold tracking-tight text-white">{value}</h3>
        {description && <p className="text-xs text-slate-500 font-medium mt-1">{description}</p>}
      </div>
      <div className={`p-3.5 rounded-xl ${colorClass || 'bg-slate-800 text-slate-300'} bg-opacity-10 backdrop-blur-md border border-white/5`}>
        {Icon && <Icon className="h-6 w-6 stroke-[2]" />}
      </div>
    </div>
  );
};

export default MetricsCard;
