
import React, { useState } from 'react';
import { Delivery, Order, Client, DeliveryStatus } from '../types';
import { 
  Truck, 
  Search, 
  Package, 
  Calendar, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowRight,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Save,
  Tag,
  AlertCircle,
  Printer
} from 'lucide-react';

interface Props {
  deliveries: Delivery[];
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>;
  orders: Order[];
  clients: Client[];
}

const DeliveryManagement: React.FC<Props> = ({ deliveries, setDeliveries, orders, clients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<DeliveryStatus | 'all'>('all');
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);

  const filtered = deliveries.filter(d => {
    const order = orders.find(o => o.id === d.orderId);
    const client = clients.find(c => c.id === order?.clientId);
    const matchesSearch = 
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: DeliveryStatus) => {
    switch (status) {
      case 'preparing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'pending_shipment': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    switch (status) {
      case 'preparing': return 'Préparation';
      case 'pending_shipment': return 'Attente Livraison';
      case 'shipped': return 'En Transit';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const handleUpdateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDelivery) return;
    
    setDeliveries(prev => prev.map(d => d.id === editingDelivery.id ? editingDelivery : d));
    setEditingDelivery(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Expéditions & Logistique</h2>
          <p className="text-sm text-slate-500 font-medium">Gestion des flux transporteurs et délais de livraison</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-black hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Printer size={18} /> Imprimer Liste
          </button>
          <div className="flex bg-white rounded-2xl p-1 border border-slate-200 shadow-sm flex-wrap">
            {(['all', 'preparing', 'pending_shipment', 'shipped', 'delivered'] as const).map(s => (
              <button 
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {s === 'all' ? 'Tous' : getStatusLabel(s as DeliveryStatus)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 no-print">
        <Search size={24} className="text-slate-300 ml-2" />
        <input 
          type="text" 
          placeholder="Rechercher expédition..." 
          className="flex-1 outline-none text-base font-bold bg-transparent text-slate-700" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="grid grid-cols-1 gap-6 no-print">
        {filtered.map(delivery => {
          const order = orders.find(o => o.id === delivery.orderId);
          const client = clients.find(c => c.id === order?.clientId);
          const isLate = new Date(delivery.estimatedArrival) < new Date() && delivery.status !== 'delivered';

          return (
            <div key={delivery.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
              <div className="flex flex-col lg:flex-row items-stretch">
                <div className={`w-full lg:w-48 flex flex-col items-center justify-center p-8 gap-3 border-r border-slate-100 ${delivery.status === 'delivered' ? 'bg-emerald-50/50' : 'bg-slate-50/50'}`}>
                  <div className={`p-4 rounded-3xl ${getStatusStyle(delivery.status)} shadow-sm`}>
                    <Truck size={32} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusStyle(delivery.status)} text-center`}>
                    {getStatusLabel(delivery.status)}
                  </span>
                </div>

                <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Référence & Client</p>
                    <h3 className="font-black text-slate-900 text-lg">{delivery.id}</h3>
                    <p className="text-sm font-bold text-indigo-600 mt-1">{client?.name || 'Client Inconnu'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">CMD #{delivery.orderId}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Transport</p>
                    <p className="text-sm font-black text-slate-700">{delivery.carrier || 'Non assigné'}</p>
                    <p className="text-[10px] font-mono font-bold text-slate-400 mt-1">{delivery.trackingNumber || 'En attente n° suivi'}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Délais</p>
                    <div className="flex items-center gap-2 text-xs font-black">
                      <Calendar size={14} className={isLate ? 'text-rose-600' : 'text-slate-400'} />
                      <span className={isLate ? 'text-rose-600' : 'text-slate-700'}>
                        Prévu: {new Date(delivery.estimatedArrival).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                     <button 
                      onClick={() => setEditingDelivery(delivery)}
                      className="p-4 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all"
                     >
                       <Edit2 size={20}/>
                     </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRINT ONLY SECTION */}
      <div className="print-only p-10 bg-white">
        <div className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">RAPPORT LOGISTIQUE</h1>
            <p className="text-xs font-bold text-slate-500 mt-2">Expéditions et livraisons au {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-black text-slate-900 uppercase">StockMaster Pro</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Suivi des flux sortants</p>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-left">ID Expédition</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-left">Client / CMD</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-left">Statut</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-left">Transporteur / Suivi</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-right">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map(delivery => {
              const order = orders.find(o => o.id === delivery.orderId);
              const client = clients.find(c => c.id === order?.clientId);
              return (
                <tr key={delivery.id}>
                  <td className="p-3 text-xs font-black">{delivery.id}</td>
                  <td className="p-3">
                    <p className="text-xs font-black text-slate-900">{client?.name || 'N/A'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">CMD #{delivery.orderId}</p>
                  </td>
                  <td className="p-3 text-[10px] font-black uppercase">
                    {getStatusLabel(delivery.status)}
                  </td>
                  <td className="p-3">
                    <p className="text-xs font-bold text-slate-700">{delivery.carrier || '---'}</p>
                    <p className="text-[10px] font-mono text-slate-400">{delivery.trackingNumber || '---'}</p>
                  </td>
                  <td className="p-3 text-xs font-black text-right">
                    {new Date(delivery.estimatedArrival).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        <div className="mt-20 border-t border-slate-100 pt-8 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Document certifié conforme par le module Logistique Expert de StockMaster Pro AI</p>
        </div>
      </div>

      {/* Edit Modal */}
      {editingDelivery && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-black text-xl tracking-tight">Édition Logistique</h3>
              <button onClick={() => setEditingDelivery(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleUpdateDelivery} className="p-10 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Statut Logistique</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 outline-none"
                  value={editingDelivery.status}
                  onChange={(e) => setEditingDelivery({...editingDelivery, status: e.target.value as DeliveryStatus})}
                >
                  <option value="preparing">Préparation</option>
                  <option value="pending_shipment">En attente de livraison</option>
                  <option value="shipped">Expédié</option>
                  <option value="delivered">Livré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Transporteur</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={editingDelivery.carrier} onChange={e => setEditingDelivery({...editingDelivery, carrier: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Numéro Suivi</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={editingDelivery.trackingNumber} onChange={e => setEditingDelivery({...editingDelivery, trackingNumber: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl transition-all flex items-center justify-center gap-3">
                <Save size={24} /> Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;
