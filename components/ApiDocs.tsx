
import React from 'react';
import { Terminal, Copy, Key, ShieldCheck, Globe } from 'lucide-react';

const ApiDocs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 bg-emerald-500/20 text-emerald-400 w-fit px-3 py-1 rounded-full border border-emerald-500/30">
            <Globe size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Connectivité ERP</span>
          </div>
          <h2 className="text-4xl font-black mb-6 tracking-tight">API REST Intégrée</h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            Synchronisez votre inventaire StockMaster avec votre site e-commerce ou application mobile en temps réel.
          </p>
          
          <div className="mt-8 flex gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex-1">
              <Key size={20} className="text-indigo-400 mb-2"/>
              <p className="text-xs font-bold text-slate-400 uppercase">Clé API Active</p>
              <p className="text-sm font-mono mt-1 text-white">stk_live_49b...2x9m</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex-1">
              <ShieldCheck size={20} className="text-emerald-400 mb-2"/>
              <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
              <p className="text-sm font-bold mt-1 text-emerald-400">Production Ready</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Terminal size={22} className="text-indigo-600" />
          Endpoints de Référence
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {[
            { method: 'GET', url: '/v1/inventory', desc: 'Lister tous les produits en stock.' },
            { method: 'POST', url: '/v1/orders', desc: 'Créer une nouvelle commande client.' },
            { method: 'GET', url: '/v1/clients/{id}', desc: 'Récupérer les informations CRM d\'un client.' },
            { method: 'PATCH', url: '/v1/stock/{sku}', desc: 'Mise à jour rapide des quantités.' }
          ].map(api => (
            <div key={api.url} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-500 transition-all">
              <div className="flex items-center gap-6">
                <span className={`w-20 text-center py-1 rounded-lg text-[10px] font-black uppercase ${
                  api.method === 'GET' ? 'bg-emerald-100 text-emerald-700' : 
                  api.method === 'POST' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                }`}>{api.method}</span>
                <div>
                  <p className="font-mono text-sm text-slate-900 font-bold">{api.url}</p>
                  <p className="text-xs text-slate-500 mt-1">{api.desc}</p>
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                <Copy size={18}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200">
        <h4 className="font-bold text-slate-900 mb-4">Exemple d'intégration (cURL)</h4>
        <pre className="bg-slate-900 text-slate-300 p-6 rounded-2xl font-mono text-sm overflow-x-auto shadow-inner">
          {`curl -X GET "https://api.stockmaster.pro/v1/inventory" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
        </pre>
      </div>
    </div>
  );
};

export default ApiDocs;
