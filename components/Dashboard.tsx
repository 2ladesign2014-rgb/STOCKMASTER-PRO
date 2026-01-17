
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { StockStats, Product } from '../types';
import { Package, AlertCircle, ShoppingBag, TrendingUp, TrendingDown, Banknote } from 'lucide-react';

interface Props {
  stats: StockStats;
  products: Product[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<Props> = ({ stats, products }) => {
  const chartData = products.map(p => ({
    name: p.name,
    stock: p.quantity,
    value: p.quantity * p.price
  })).slice(0, 5);

  const StatCard = ({ label, value, icon: Icon, color, trend, trendLabel }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          {trend && (
            <div className={`flex items-center mt-3 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
              {trendLabel}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Bienvenue, Administrateur</h1>
        <p className="text-slate-500">Voici l'aperçu de vos stocks au {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Valeur Totale" 
          value={`${stats.totalValue.toLocaleString('fr-FR')} FCFA`} 
          icon={Banknote} 
          color="bg-indigo-600"
          trend="up"
          trendLabel="+12.5% vs mois dernier"
        />
        <StatCard 
          label="Articles en Stock" 
          value={stats.totalItems} 
          icon={Package} 
          color="bg-emerald-500"
          trend="up"
          trendLabel="+43 nouveaux articles"
        />
        <StatCard 
          label="Stock Faible" 
          value={stats.lowStockCount} 
          icon={AlertCircle} 
          color="bg-amber-500"
          trend="down"
          trendLabel="-5 articles réapprovisionnés"
        />
        <StatCard 
          label="Rupture de Stock" 
          value={stats.outOfStockCount} 
          icon={ShoppingBag} 
          color="bg-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique à barres */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600" />
            Niveaux de Stock Actuels (Top 5)
          </h3>
          <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="stock" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique en secteurs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6">Répartition de la Valeur</h3>
          <div className="h-[300px] w-full flex items-center">
            <div className="flex-1 h-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="hidden sm:block ml-4 space-y-2 w-1/3">
               {chartData.map((d, i) => (
                 <div key={i} className="flex items-center gap-2 text-[10px] text-slate-600">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                    <span className="truncate">{d.name}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
