
import React from 'react';
import { Transaction, Product } from '../types';
import { ArrowUpRight, ArrowDownRight, Clock, User, Printer, FileText } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  products: Product[];
}

const TransactionHistory: React.FC<Props> = ({ transactions, products }) => {
  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Produit inconnu';
  const getProductSku = (id: string) => products.find(p => p.id === id)?.sku || '---';

  const handlePrintJournal = () => window.print();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Journal des Mouvements</h2>
          <p className="text-sm text-slate-500">Historique complet des entrées et sorties de stock</p>
        </div>
        <button onClick={handlePrintJournal} className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-all font-bold shadow-sm">
          <Printer size={20} /> Imprimer Journal
        </button>
      </div>

      <div className="space-y-3 no-print">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-indigo-200 transition-colors shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${tx.type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {tx.type === 'IN' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{getProductName(tx.productId)}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Clock size={12} /> {tx.date}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {tx.user}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'IN' ? '+' : '-'}{tx.quantity} Unités
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold mt-1">Flux {tx.type}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-300 text-center">
            <FileText size={48} className="mx-auto text-slate-200 mb-4"/>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun mouvement enregistré</p>
          </div>
        )}
      </div>

      {/* Rendu Impression Journal */}
      <div className="print-only">
        <div className="border-b-4 border-slate-900 pb-8 mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-indigo-600">JOURNAL D'AUDIT STOCK</h1>
            <p className="text-xs font-bold text-slate-500 mt-2">Mouvements logistiques enregistrés au {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black uppercase">Service Logistique</p>
            <p className="text-[10px] text-slate-400">StockMaster Pro AI</p>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-4 text-left text-[10px] font-black uppercase">Date & Heure</th>
              <th className="p-4 text-left text-[10px] font-black uppercase">Produit</th>
              <th className="p-4 text-left text-[10px] font-black uppercase">SKU</th>
              <th className="p-4 text-center text-[10px] font-black uppercase">Type</th>
              <th className="p-4 text-right text-[10px] font-black uppercase">Quantité</th>
              <th className="p-4 text-right text-[10px] font-black uppercase">Opérateur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td className="p-4 text-[10px] font-bold text-slate-500">{tx.date}</td>
                <td className="p-4 text-sm font-black text-slate-900">{getProductName(tx.productId)}</td>
                <td className="p-4 text-[10px] font-mono font-bold uppercase">{getProductSku(tx.productId)}</td>
                <td className={`p-4 text-center text-[10px] font-black uppercase ${tx.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>{tx.type === 'IN' ? 'ENTRÉE' : 'SORTIE'}</td>
                <td className={`p-4 text-right text-sm font-black ${tx.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'IN' ? '+' : '-'}{tx.quantity}
                </td>
                <td className="p-4 text-right text-xs font-bold">{tx.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-20 grid grid-cols-2 gap-10">
           <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
             <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Résumé Logistique</h4>
             <div className="space-y-2 text-xs font-bold">
               <div className="flex justify-between"><span>Total Entrées :</span> <span className="text-emerald-600">+{transactions.filter(t => t.type === 'IN').reduce((a, b) => a + b.quantity, 0)} unités</span></div>
               <div className="flex justify-between"><span>Total Sorties :</span> <span className="text-rose-600">-{transactions.filter(t => t.type === 'OUT').reduce((a, b) => a + b.quantity, 0)} unités</span></div>
             </div>
           </div>
           <div className="flex flex-col justify-end text-right">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-10">Visa Contrôleur Stock</p>
             <div className="w-40 h-px bg-slate-200 self-end"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
