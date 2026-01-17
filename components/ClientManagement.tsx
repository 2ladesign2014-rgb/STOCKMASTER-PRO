
import React, { useState, useMemo } from 'react';
import { Client, Order } from '../types';
import { Plus, Search, Mail, Phone, MapPin, Building, Edit2, Trash2, Wallet, AlertCircle, TrendingUp, Banknote, X, Save, UserPlus, Printer } from 'lucide-react';

interface Props {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  orders: Order[];
}

const ClientManagement: React.FC<Props> = ({ clients, setClients, orders }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clientStats = useMemo(() => {
    const stats: Record<string, { debt: number, paidCount: number, totalOrders: number }> = {};
    clients.forEach(c => {
      const clientOrders = orders.filter(o => o.clientId === c.id);
      const debt = clientOrders.reduce((acc, o) => acc + (o.totalAmount - o.paidAmount), 0);
      const paidCount = clientOrders.filter(o => o.status === 'paid').length;
      stats[c.id] = { debt, paidCount, totalOrders: clientOrders.length };
    });
    return stats;
  }, [clients, orders]);

  const handlePrintCRM = () => window.print();

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.phone) return;
    const clientToAdd: Client = { id: `CL-${Date.now().toString().slice(-6)}`, ...newClient };
    setClients(prev => [...prev, clientToAdd]);
    setNewClient({ name: '', email: '', phone: '', address: '', company: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Espace CRM & Créances</h2>
          <p className="text-sm text-slate-500 font-medium">Vue stratégique sur vos relations commerciales</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrintCRM} className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-all font-bold shadow-sm">
            <Printer size={20} /> Imprimer Rapport
          </button>
          <button onClick={() => setShowAdd(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl flex items-center gap-3 hover:bg-indigo-700 transition-all font-black shadow-xl shadow-indigo-600/20">
            <Plus size={20} /> Nouveau Profil
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 no-print">
        <Search size={24} className="text-slate-300 ml-2" />
        <input type="text" placeholder="Recherche client..." className="flex-1 outline-none text-base font-bold bg-transparent text-slate-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
        {filtered.map(client => {
          const stats = clientStats[client.id] || { debt: 0, paidCount: 0, totalOrders: 0 };
          return (
            <div key={client.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl uppercase italic">{client.name.charAt(0)}</div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900">{client.name}</h3>
                    <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{client.company || 'Client Particulier'}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-2 text-xs font-bold text-slate-500">
                  <p className="flex items-center gap-2"><Phone size={14}/> {client.phone}</p>
                  <p className="flex items-center gap-2"><Mail size={14}/> {client.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Encours total</p>
                  <p className={`text-xl font-black ${stats.debt > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{stats.debt.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rendu Impression CRM */}
      <div className="print-only">
        <div className="border-b-4 border-slate-900 pb-8 mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-indigo-600">RAPPORT CRM</h1>
            <p className="text-xs font-bold text-slate-500 mt-2">État des créances et annuaire clients au {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black uppercase">StockMaster Pro</p>
            <p className="text-[10px] text-slate-400">Document interne confidentiel</p>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-4 text-left text-[10px] font-black uppercase">Nom du Client</th>
              <th className="p-4 text-left text-[10px] font-black uppercase">Entreprise</th>
              <th className="p-4 text-left text-[10px] font-black uppercase">Contact</th>
              <th className="p-4 text-center text-[10px] font-black uppercase">Commandes</th>
              <th className="p-4 text-right text-[10px] font-black uppercase">Dette (FCFA)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {clients.map(client => {
              const stats = clientStats[client.id] || { debt: 0, totalOrders: 0 };
              return (
                <tr key={client.id}>
                  <td className="p-4 text-sm font-black text-slate-900">{client.name}</td>
                  <td className="p-4 text-xs font-bold text-slate-500">{client.company || '-'}</td>
                  <td className="p-4 text-[10px] font-bold">
                    <p>{client.phone}</p>
                    <p className="text-slate-400">{client.email}</p>
                  </td>
                  <td className="p-4 text-center text-xs font-black">{stats.totalOrders}</td>
                  <td className={`p-4 text-right text-sm font-black ${stats.debt > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{stats.debt.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-black">
              <td colSpan={4} className="p-4 text-right text-xs uppercase">Total Créances Clients</td>
              <td className="p-4 text-right text-lg text-rose-600">
                {clients.reduce((acc, c) => acc + (clientStats[c.id]?.debt || 0), 0).toLocaleString()} FCFA
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-4"><UserPlus size={32} className="text-indigo-600"/> Nouveau Partenaire</h3>
            <form onSubmit={handleAddClient} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <input required placeholder="Nom complet" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                <input placeholder="Entreprise" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newClient.company} onChange={e => setNewClient({...newClient, company: e.target.value})} />
                <input required placeholder="Téléphone" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
              </div>
              <textarea placeholder="Adresse géographique" rows={2} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
