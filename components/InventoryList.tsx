
import React, { useState, useMemo, useRef } from 'react';
import { Product, StoreConfig } from '../types';
import { 
  Package, 
  ArrowUpDown, 
  ChevronUp,
  ChevronDown,
  FileUp,
  FileDown,
  QrCode,
  Printer,
  X,
  FileText
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  products: Product[];
  storeConfig: StoreConfig;
  onUpdateStock: (id: string, newQty: number) => void;
  onBulkImport: (newProducts: Product[]) => void;
}

type SortKey = 'name' | 'quantity' | 'price';
type SortOrder = 'asc' | 'desc';

const InventoryList: React.FC<Props> = ({ 
  products, 
  storeConfig, 
  onUpdateStock, 
  onBulkImport
}) => {
  const [filter, setFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showQR, setShowQR] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedAndFilteredProducts = useMemo(() => {
    let result = products.filter(p => {
      if (filter === 'low') return p.quantity > 0 && p.quantity <= p.minThreshold;
      if (filter === 'out') return p.quantity === 0;
      return true;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortKey === 'quantity') comparison = a.quantity - b.quantity;
      else if (sortKey === 'price') comparison = a.price - b.price;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, filter, sortKey, sortOrder]);

  const handleExportPDF = () => {
    window.print();
  };

  const SortIndicator = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown size={14} className="ml-1 opacity-30" />;
    return sortOrder === 'asc' ? <ChevronUp size={14} className="ml-1 text-indigo-600" /> : <ChevronDown size={14} className="ml-1 text-indigo-600" />;
  };

  const totalStockValue = sortedAndFilteredProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  const totalStockItems = sortedAndFilteredProducts.reduce((acc, p) => acc + p.quantity, 0);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Suivi des Stocks</h2>
          <p className="text-sm text-slate-500">{products.length} articles référencés</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
            <FileText size={16} /> <span className="hidden sm:inline">Imprimer Rapport</span>
          </button>
          
          <div className="flex bg-white rounded-xl p-1 border border-slate-200 ml-4">
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>TOUS</button>
            <button onClick={() => setFilter('low')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${filter === 'low' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}>BAS</button>
            <button onClick={() => setFilter('out')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${filter === 'out' ? 'bg-rose-600 text-white' : 'text-slate-500'}`}>RUPTURE</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('name')}><div className="flex items-center">Produit <SortIndicator k="name" /></div></th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4" onClick={() => toggleSort('quantity')}><div className="flex items-center">Stock Actuel <SortIndicator k="quantity" /></div></th>
                <th className="px-6 py-4" onClick={() => toggleSort('price')}><div className="flex items-center">Prix Unit. <SortIndicator k="price" /></div></th>
                <th className="px-6 py-4">Valeur Totale</th>
                <th className="px-6 py-4 text-right">Identifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedAndFilteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded text-slate-500">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onUpdateStock(p.id, Math.max(0, p.quantity - 1))} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-all font-black">-</button>
                        <span className={`text-sm font-black w-8 text-center ${p.quantity === 0 ? 'text-rose-600' : p.quantity <= p.minThreshold ? 'text-amber-500' : 'text-slate-900'}`}>{p.quantity}</span>
                        <button onClick={() => onUpdateStock(p.id, p.quantity + 1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-all font-black">+</button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-700">{p.price.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4 text-sm font-black text-indigo-600">{(p.price * p.quantity).toLocaleString()} FCFA</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setShowQR(p)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"><QrCode size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT ONLY SECTION - Fixed: no 'hidden' class here anymore */}
      <div className="print-only p-10 bg-white min-h-screen">
        <div className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-8">
          <div className="flex items-center gap-4">
            {storeConfig.logoUrl && <img src={storeConfig.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />}
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{storeConfig.name}</h1>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{storeConfig.slogan}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-black text-slate-900 uppercase">Rapport de Stock Instantané</h2>
            <p className="text-xs font-bold text-slate-500 mt-1">Généré le: {new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white border border-slate-900">
              <th className="p-3 text-[10px] font-black uppercase tracking-widest">SKU</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest">Désignation</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-center">Quantité</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-right">PU (FCFA)</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-right">Valeur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedAndFilteredProducts.map((p) => (
              <tr key={p.id}>
                <td className="p-3 text-[10px] font-mono font-bold">{p.sku}</td>
                <td className="p-3 text-xs font-black text-slate-900">{p.name}</td>
                <td className="p-3 text-xs font-black text-center">{p.quantity}</td>
                <td className="p-3 text-xs font-bold text-right">{p.price.toLocaleString()}</td>
                <td className="p-3 text-xs font-black text-right">{(p.price * p.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-black">
              <td colSpan={2} className="p-4 text-right text-xs uppercase">Total Général</td>
              <td className="p-4 text-center text-xs">{totalStockItems} Unités</td>
              <td colSpan={2} className="p-4 text-right text-base text-indigo-600">{totalStockValue.toLocaleString()} FCFA</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900">QR Code Identifiant</h3>
              <button onClick={() => setShowQR(null)}><X size={20}/></button>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
              <QRCodeSVG value={showQR.sku} size={200} />
            </div>
            <div>
              <p className="font-bold text-slate-900">{showQR.name}</p>
              <p className="text-xs text-slate-500 mt-1">SKU: {showQR.sku}</p>
            </div>
            <button onClick={() => window.print()} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <Printer size={18}/> Imprimer l'étiquette
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
