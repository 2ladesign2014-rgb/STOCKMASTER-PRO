
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Package, ArrowRightLeft, Sparkles, Search, Plus, Bell, 
  Menu, X, Users, ShoppingCart, Terminal, Settings as SettingsIcon, 
  Lock, Wifi, WifiOff, Database, BookOpen, Truck
} from 'lucide-react';
import { Product, Transaction, ViewType, StockStats, Client, Order, StoreConfig, Delivery } from './types';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import TransactionHistory from './components/TransactionHistory';
import AIInsights from './components/AIInsights';
import ClientManagement from './components/ClientManagement';
import OrderManagement from './components/OrderManagement';
import DeliveryManagement from './components/DeliveryManagement';
import ApiDocs from './components/ApiDocs';
import Settings from './components/Settings';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', sku: 'LAP-001', name: 'MacBook Pro M3', category: 'Electronique', quantity: 15, minThreshold: 5, price: 1650000, supplier: 'Apple Inc', lastUpdated: '2023-10-24' },
  { id: '2', sku: 'MOU-002', name: 'Logitech MX Master 3S', category: 'Accessoires', quantity: 45, minThreshold: 10, price: 65000, supplier: 'Logitech', lastUpdated: '2023-10-25' },
];

const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'Jean Dupont', email: 'jean@dupont.com', phone: '0612345678', address: 'Abidjan', company: 'TechSolutions SAS' },
];

const INITIAL_STORE_CONFIG: StoreConfig = {
  name: 'STOCKMASTER PRO',
  logoUrl: '',
  address: 'Avenue des Affaires, Immeuble Alpha',
  email: 'contact@stockmaster.pro',
  phone: '+225 01 02 03 04 05',
  slogan: 'L\'ERP Nouvelle Génération',
  pinCode: '0000' 
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('sm_products_v2');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch { return INITIAL_PRODUCTS; }
  });
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('sm_clients_v2');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch { return INITIAL_CLIENTS; }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('sm_orders_v2');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    try {
      const saved = localStorage.getItem('sm_deliveries_v2');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('sm_transactions_v2');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('sm_config_v2');
      return saved ? JSON.parse(saved) : INITIAL_STORE_CONFIG;
    } catch { return INITIAL_STORE_CONFIG; }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Persistence automatique vers localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sm_products_v2', JSON.stringify(products));
      localStorage.setItem('sm_clients_v2', JSON.stringify(clients));
      localStorage.setItem('sm_orders_v2', JSON.stringify(orders));
      localStorage.setItem('sm_deliveries_v2', JSON.stringify(deliveries));
      localStorage.setItem('sm_transactions_v2', JSON.stringify(transactions));
      localStorage.setItem('sm_config_v2', JSON.stringify(storeConfig));
    } catch (e) {
      console.error("Erreur de sauvegarde locale:", e);
    }
  }, [products, clients, orders, deliveries, transactions, storeConfig]);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const stats: StockStats = useMemo(() => ({
    totalValue: products.reduce((acc, p) => acc + (p.price * p.quantity), 0),
    totalItems: products.reduce((acc, p) => acc + p.quantity, 0),
    lowStockCount: products.filter(p => p.quantity > 0 && p.quantity <= p.minThreshold).length,
    outOfStockCount: products.filter(p => p.quantity === 0).length
  }), [products]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Main' },
    { id: 'inventory', label: 'Inventaire', icon: Package, group: 'Main' },
    { id: 'transactions', label: 'Mouvements', icon: ArrowRightLeft, group: 'Main' },
    { id: 'ai-insights', label: 'Analyses IA', icon: Sparkles, group: 'Main' },
    { id: 'clients', label: 'Clients CRM', icon: Users, group: 'Commerce' },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart, group: 'Commerce' },
    { id: 'deliveries', label: 'Livraisons', icon: Truck, group: 'Commerce' },
    { id: 'api-docs', label: 'API REST', icon: Terminal, group: 'Système' },
    { id: 'settings', label: 'Configuration', icon: SettingsIcon, group: 'Système' },
  ];

  const handleNavClick = (id: ViewType) => {
    if (id === 'settings') { setIsPinModalOpen(true); setPinInput(''); setPinError(false); }
    else setActiveView(id);
  };

  useEffect(() => {
    if (pinInput.length === 4) {
      if (pinInput === storeConfig.pinCode) { setActiveView('settings'); setIsPinModalOpen(false); }
      else { setPinError(true); setTimeout(() => setPinInput(''), 500); }
    }
  }, [pinInput, storeConfig.pinCode]);

  const handleUpdateStock = (id: string, newQty: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: newQty, lastUpdated: new Date().toISOString() } : p));
    const p = products.find(x => x.id === id);
    if (p) {
      setTransactions(prev => [{
        id: Date.now().toString(), productId: id, type: newQty > p.quantity ? 'IN' : 'OUT',
        quantity: Math.abs(newQty - p.quantity), date: new Date().toLocaleString(), user: 'Admin'
      }, ...prev]);
    }
  };

  const handleAddOrder = (order: Order) => {
    const existingOrder = orders.find(o => o.id === order.id);
    if (!existingOrder) {
      order.items.forEach(item => {
        const p = products.find(prod => prod.id === item.productId);
        if (p) {
          handleUpdateStock(item.productId, p.quantity - item.quantity);
        }
      });
      setOrders(prev => [order, ...prev]);
    } else {
      setOrders(prev => prev.map(o => o.id === order.id ? order : o));
    }
  };

  const handleAddDelivery = (delivery: Delivery) => {
    setDeliveries(prev => [delivery, ...prev]);
    setActiveView('deliveries');
  };

  const handleBackup = () => {
    try {
      const backupData = {
        products,
        clients,
        orders,
        deliveries,
        transactions,
        storeConfig,
        backupDate: new Date().toISOString(),
        version: "2.0"
      };
      
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stockmaster_db_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      alert("Erreur fatale lors de l'export : " + (err as Error).message);
    }
  };

  // Correction : handleRestore fiabilisé
  const handleRestore = async (file: File) => {
    if (!file) return;

    const readFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(new Error("Erreur de lecture du fichier"));
        reader.readAsText(file);
      });
    };

    try {
      const content = await readFile(file);
      const data = JSON.parse(content);
      
      // Validation stricte du contenu
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Le fichier est corrompu ou n'est pas une sauvegarde StockMaster valide.");
      }

      // Mise à jour synchrone de tous les états
      setProducts(data.products);
      setClients(data.clients || []);
      setOrders(data.orders || []);
      setDeliveries(data.deliveries || []);
      setTransactions(data.transactions || []);
      setStoreConfig(data.storeConfig || INITIAL_STORE_CONFIG);

      // Persistence forcée immédiate pour garantir que le localStorage est à jour
      localStorage.setItem('sm_products_v2', JSON.stringify(data.products));
      localStorage.setItem('sm_clients_v2', JSON.stringify(data.clients || []));
      localStorage.setItem('sm_orders_v2', JSON.stringify(data.orders || []));
      localStorage.setItem('sm_deliveries_v2', JSON.stringify(data.deliveries || []));
      localStorage.setItem('sm_transactions_v2', JSON.stringify(data.transactions || []));
      localStorage.setItem('sm_config_v2', JSON.stringify(data.storeConfig || INITIAL_STORE_CONFIG));

      alert('Restauration réussie ! L\'application va se rafraîchir pour appliquer les changements.');
      window.location.reload(); // Recharger pour garantir un état propre
      
    } catch (err) {
      console.error("Restauration échouée:", err);
      alert('Échec de la restauration : ' + (err as Error).message);
    }
  };

  const handleReset = () => {
    if (confirm("🚨 ATTENTION : Vous allez supprimer TOUTES les données définitivement. Cette action est irréversible. Continuer ?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-[#0f172a] transition-all duration-500 flex flex-col shadow-2xl z-40 no-print shrink-0`}>
        <div className="p-8 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                {storeConfig.logoUrl ? <img src={storeConfig.logoUrl} className="w-full h-full object-contain" /> : <Database className="text-white" size={20} />}
              </div>
              <h1 className="font-black text-white tracking-tighter italic uppercase text-base truncate">{storeConfig.name}</h1>
            </div>
          ) : (
             <div className="mx-auto bg-indigo-600 p-2 rounded-xl"><Database size={20} className="text-white"/></div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-6 mt-6 overflow-y-auto custom-scrollbar">
          {['Main', 'Commerce', 'Système'].map(group => (
            <div key={group} className="space-y-2">
              {isSidebarOpen && <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">{group}</p>}
              <div className="space-y-1">
                {navItems.filter(i => i.group === group).map((item) => {
                  const Icon = item.icon;
                  const hasActiveDeliveries = item.id === 'deliveries' && deliveries.some(d => ['preparing', 'pending_shipment'].includes(d.status));
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id as ViewType)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                        activeView === item.id 
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <Icon size={20} />
                        {(item.id === 'inventory' && stats.lowStockCount > 0 || hasActiveDeliveries) && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0f172a]"></span>
                        )}
                      </div>
                      {isSidebarOpen && <span className="font-bold text-sm truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-3 bg-white/5 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-black text-white text-xs shrink-0">A</div>
            {isSidebarOpen && (
              <div className="truncate">
                <p className="text-[10px] font-black text-white uppercase">Administrateur</p>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Connecté</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 z-30 no-print shrink-0">
          <div className="flex items-center gap-6 bg-slate-100 px-6 py-2.5 rounded-2xl w-full max-lg group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="text-slate-400 group-focus-within:text-indigo-600" size={16} />
            <input type="text" placeholder="Recherche dynamique..." className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-700 placeholder:text-slate-400" />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className={`text-[10px] font-black flex items-center gap-2 ${isOnline ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isOnline ? 'IA OPÉRATIONNELLE' : 'MODE OFFLINE'}
              </span>
            </div>
            <button className="p-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 relative transition-all active:scale-95">
              <Bell size={18} />
              {stats.lowStockCount > 0 && <span className="absolute top-2.5 right-2.5 bg-rose-500 w-2 h-2 rounded-full border-2 border-white"></span>}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#f8fafc] custom-scrollbar">
          {activeView === 'dashboard' && <Dashboard stats={stats} products={products} />}
          {activeView === 'inventory' && <InventoryList products={products} storeConfig={storeConfig} onUpdateStock={handleUpdateStock} onBulkImport={setProducts} />}
          {activeView === 'transactions' && <TransactionHistory transactions={transactions} products={products} />}
          {activeView === 'ai-insights' && <AIInsights products={products} />}
          {activeView === 'clients' && <ClientManagement clients={clients} setClients={setClients} orders={orders} />}
          {activeView === 'orders' && <OrderManagement orders={orders} products={products} clients={clients} storeConfig={storeConfig} onAddOrder={handleAddOrder} onGenerateDelivery={handleAddDelivery} deliveries={deliveries} />}
          {activeView === 'deliveries' && <DeliveryManagement deliveries={deliveries} setDeliveries={setDeliveries} orders={orders} clients={clients} />}
          {activeView === 'api-docs' && <ApiDocs />}
          {activeView === 'settings' && (
            <Settings 
              config={storeConfig} onUpdateConfig={setStoreConfig}
              products={products} onAddProduct={p => setProducts([p, ...products])}
              onEditProduct={p => setProducts(products.map(x => x.id === p.id ? p : x))}
              onDeleteProduct={id => setProducts(products.filter(x => x.id !== id))}
              onBackup={handleBackup} onRestore={handleRestore}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      {/* PIN MODAL */}
      {isPinModalOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-sm rounded-[3rem] shadow-2xl p-12 flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 mb-8">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 text-center tracking-tight mb-8">Accès Configuration</h3>
            
            <div className="flex gap-4 mb-10">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${pinInput.length > i ? 'bg-indigo-600 scale-125 shadow-lg shadow-indigo-600/30' : pinError ? 'bg-rose-500 animate-pulse' : 'bg-slate-200'}`} />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'X'].map(val => (
                <button 
                  key={val} 
                  onClick={() => {
                    if (val === 'C') setPinInput('');
                    else if (val === 'X') setIsPinModalOpen(false);
                    else if (pinInput.length < 4) setPinInput(p => p + val);
                  }}
                  className={`h-16 rounded-2xl flex items-center justify-center text-xl font-black transition-all active:scale-90 shadow-sm ${
                    val === 'X' ? 'bg-rose-50 text-rose-600' : val === 'C' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-700 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  {val === 'X' ? <X size={20}/> : val}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
