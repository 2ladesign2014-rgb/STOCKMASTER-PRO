
import React, { useRef, useState } from 'react';
import { StoreConfig, Product } from '../types';
import { 
  Settings as SettingsIcon, 
  Store, 
  Image as ImageIcon, 
  MapPin, 
  Mail, 
  Phone, 
  Save, 
  Sparkles, 
  Upload, 
  X as CloseIcon, 
  Lock, 
  Key,
  Package,
  Plus,
  Edit3,
  Trash2,
  Tag,
  Truck,
  Layers,
  DollarSign,
  ImagePlus,
  Database,
  Download,
  ShieldCheck,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface Props {
  config: StoreConfig;
  onUpdateConfig: (config: StoreConfig) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onBackup: () => void;
  onRestore: (file: File) => void;
  onReset: () => void;
}

const Settings: React.FC<Props> = ({ 
  config, 
  onUpdateConfig, 
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onBackup,
  onRestore,
  onReset
}) => {
  const [localConfig, setLocalConfig] = React.useState(config);
  const [showPin, setShowPin] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    minThreshold: 5,
    price: 0,
    supplier: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localConfig.pinCode.length !== 4 || isNaN(Number(localConfig.pinCode))) {
      alert("Le code PIN doit comporter exactement 4 chiffres.");
      return;
    }
    onUpdateConfig(localConfig);
    alert('Configuration enregistrée avec succès !');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image est trop volumineuse (max 2Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setLocalConfig({ ...localConfig, logoUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleRestoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (confirm('🚨 ATTENTION : La restauration écrasera TOUTES vos données actuelles. Assurez-vous d\'avoir une sauvegarde de l\'état actuel. Continuer ?')) {
        onRestore(file);
      }
      // Reset de l'input pour permettre de sélectionner le même fichier ou un nouveau
      e.target.value = ''; 
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      category: '',
      quantity: 0,
      minThreshold: 5,
      price: 0,
      supplier: ''
    });
    setShowProductModal(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setShowProductModal(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Product = {
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      sku: formData.sku || '',
      name: formData.name || '',
      category: formData.category || 'Général',
      quantity: Number(formData.quantity) || 0,
      minThreshold: Number(formData.minThreshold) || 5,
      price: Number(formData.price) || 0,
      supplier: formData.supplier || 'Inconnu',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (editingProduct) onEditProduct(productData);
    else onAddProduct(productData);
    
    setShowProductModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Espace Administrateur</h2>
          <p className="text-sm text-slate-500 font-medium">Gestion du catalogue et configuration système sécurisée</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          
          {/* MAINTENANCE & DATABASE SECTION */}
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10"><Database size={120}/></div>
            <div className="relative z-10">
              <h3 className="text-xl font-black flex items-center gap-3 mb-2 uppercase tracking-tight">
                <Database size={24} className="text-indigo-400" />
                Maintenance & Base de Données Offline
              </h3>
              <p className="text-slate-400 text-sm mb-10">Gestion native de la persistence. En cas de dysfonctionnement, utilisez les outils d'export ou de réinitialisation.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                      <Download size={24}/>
                    </div>
                    <div>
                      <p className="font-black text-sm">Sauvegarde</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Exporter vers .json</p>
                    </div>
                  </div>
                  <button 
                    onClick={onBackup}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                  >
                    Lancer l'Export
                  </button>
                </div>

                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                      <RefreshCw size={24}/>
                    </div>
                    <div>
                      <p className="font-black text-sm">Restauration</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Importer fichier .json</p>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={restoreInputRef} 
                    className="hidden" 
                    accept=".json,application/json"
                    onChange={handleRestoreChange} 
                  />
                  <button 
                    onClick={() => restoreInputRef.current?.click()}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
                  >
                    Parcourir Fichier
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                 <div className="flex items-center justify-between bg-rose-500/10 p-6 rounded-3xl border border-rose-500/20">
                    <div className="flex items-center gap-4">
                       <AlertTriangle className="text-rose-400" size={32}/>
                       <div>
                          <p className="font-black text-sm text-white">Réinitialisation d'Urgence</p>
                          <p className="text-xs text-rose-300">Nettoie totalement la mémoire et recharge l'application.</p>
                       </div>
                    </div>
                    <button 
                       onClick={onReset}
                       className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
                    >
                       Reset Global
                    </button>
                 </div>
                 
                 <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full w-fit">
                    <ShieldCheck size={14}/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Storage Local : {JSON.stringify(localStorage).length} octets utilisés</span>
                 </div>
              </div>
            </div>
          </div>

          {/* CATALOG MANAGEMENT SECTION */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Package size={24} className="text-indigo-600" />
                Gestion du Catalogue Produit
              </h3>
              <button 
                onClick={openAddProduct}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 text-xs"
              >
                <Plus size={18} /> Nouveau Produit
              </button>
            </div>

            <div className="overflow-hidden border border-slate-100 rounded-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Article</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4 text-right">Prix</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{p.category}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{p.sku}</td>
                      <td className="px-6 py-4 text-right font-black text-indigo-600 text-sm">{p.price.toLocaleString()} FCFA</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditProduct(p)} className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Edit3 size={16}/></button>
                          <button onClick={() => { if(confirm('Supprimer ce produit ?')) onDeleteProduct(p.id); }} className="p-2 text-slate-400 hover:text-rose-600 transition-all"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Store size={24} className="text-indigo-600" />
                Identité de l'Enseigne
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Logo de l'entreprise</label>
                  <div className="flex items-center gap-8">
                    <div className="w-32 h-32 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                      {localConfig.logoUrl ? (
                        <img src={localConfig.logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="text-slate-300" size={40} />
                      )}
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-slate-900/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                      >
                        <Upload size={24} />
                      </button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-bold text-slate-900">Importer une nouvelle icône</p>
                      <p className="text-xs text-slate-400 leading-relaxed">Format recommandé : PNG ou SVG. Max 2Mo. Ce logo sera utilisé sur vos factures et rapports d'inventaire.</p>
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        Choisir un fichier
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nom Commercial</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    value={localConfig.name}
                    onChange={(e) => setLocalConfig({...localConfig, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Slogan d'Entreprise</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    value={localConfig.slogan}
                    onChange={(e) => setLocalConfig({...localConfig, slogan: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Adresse Siège Social</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    value={localConfig.address}
                    onChange={(e) => setLocalConfig({...localConfig, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Lock size={24} className="text-rose-600" />
                Sécurité & Accès
              </h3>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Code PIN Administrateur</label>
                <div className="relative max-w-[240px]">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPin ? "text" : "password"}
                    maxLength={4}
                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl font-black text-2xl tracking-[1em] text-center text-slate-900 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
                    value={localConfig.pinCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length <= 4) setLocalConfig({...localConfig, pinCode: val});
                    }}
                  />
                  <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-indigo-600 uppercase tracking-widest">
                    {showPin ? "Cacher" : "Voir"}
                  </button>
                </div>
                <p className="text-[10px] font-bold text-slate-400 italic">Protège l'accès aux paramètres et à la gestion du catalogue.</p>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-black shadow-2xl shadow-slate-900/20 transition-all active:scale-95"
            >
              <Save size={24} /> Enregistrer la Configuration Globale
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden sticky top-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 opacity-60">Visualisation Directe</h4>
            
            <div className="flex flex-col items-center text-center gap-6">
               <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden shadow-xl flex items-center justify-center p-3 border-4 border-white/20">
                  {localConfig.logoUrl ? <img src={localConfig.logoUrl} className="w-full h-full object-contain" /> : <Store size={40} className="text-indigo-200"/>}
               </div>
               <div>
                  <h5 className="text-3xl font-black tracking-tighter italic uppercase">{localConfig.name || 'Ma Boutique'}</h5>
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mt-2">{localConfig.slogan || 'Slogan boutique'}</p>
               </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-indigo-200">
                  <span>Catalogue :</span>
                  <span className="text-white text-base">{products.length} articles</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-indigo-200">
                  <span>Valeur Totale :</span>
                  <span className="text-white text-base">{products.reduce((a,p) => a + (p.price*p.quantity), 0).toLocaleString()} FCFA</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL GESTION PRODUIT */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500 rounded-2xl">
                  {editingProduct ? <Edit3 size={24} /> : <Plus size={24} />}
                </div>
                <div>
                  <h3 className="font-black text-xl">{editingProduct ? 'Modifier l\'Article' : 'Nouveau Produit au Catalogue'}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Édition du Référentiel</p>
                </div>
              </div>
              <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><CloseIcon size={24}/></button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nom du Produit</label>
                  <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SKU / Code Barre</label>
                  <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prix de Vente (FCFA)</label>
                  <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-indigo-600" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Catégorie</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quantité Initiale</label>
                  <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Seuil Alerte Stock Bas</label>
                  <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={formData.minThreshold} onChange={e => setFormData({...formData, minThreshold: parseInt(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
                {editingProduct ? 'Mettre à jour la fiche' : 'Inscrire au Catalogue'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
