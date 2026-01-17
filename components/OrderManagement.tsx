
import React, { useState, useEffect } from 'react';
import { Order, Product, Client, OrderItem, PaymentRecord, PaymentSchedule, PaymentMethod, StoreConfig, Delivery } from '../types';
import { 
  Plus, 
  ShoppingCart, 
  FileText, 
  Printer, 
  CheckCircle, 
  Clock, 
  X, 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  ChevronRight,
  Info,
  Package,
  Users,
  Banknote,
  Hash,
  Store,
  Truck,
  ArrowRight,
  Split
} from 'lucide-react';

interface Props {
  orders: Order[];
  products: Product[];
  clients: Client[];
  storeConfig: StoreConfig;
  onAddOrder: (order: Order) => void;
  onGenerateDelivery: (delivery: Delivery) => void;
  deliveries: Delivery[];
}

const OrderManagement: React.FC<Props> = ({ orders, products, clients, storeConfig, onAddOrder, onGenerateDelivery, deliveries }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showInvoice, setShowInvoice] = useState<Order | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<Order | null>(null);

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Orange Money');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [distributionMode, setDistributionMode] = useState<'auto' | 'manual'>('auto');
  const [manualDistribution, setManualDistribution] = useState<Record<string, number>>({});

  // Sync manual distribution total to payment amount when switching or changing values
  // Fixed type inference error for Object.values reduce arguments by explicitly typing a and b as numbers
  const totalDistributed = Object.values(manualDistribution).reduce((a: number, b: number) => a + b, 0);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { productId, quantity: 1, unitPrice: product.price, paidAmount: 0 }];
    });
  };

  const createOrder = () => {
    if (!selectedClient || cart.length === 0) return;
    const total = cart.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      clientId: selectedClient,
      items: cart,
      status: 'unpaid',
      date: new Date().toLocaleDateString('fr-FR'),
      totalAmount: total,
      paidAmount: 0,
      payments: [],
      schedules: []
    };
    onAddOrder(newOrder);
    setCart([]);
    setSelectedClient('');
    setShowCreate(false);
  };

  const handleShipOrder = (order: Order) => {
    const newDelivery: Delivery = {
      id: `DLV-${Date.now().toString().slice(-6)}`,
      orderId: order.id,
      carrier: '',
      trackingNumber: '',
      status: 'pending_shipment',
      estimatedArrival: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    };
    onGenerateDelivery(newDelivery);
  };

  const handleAddPayment = () => {
    if (!showPaymentModal) return;
    
    const finalAmount = distributionMode === 'auto' ? paymentAmount : totalDistributed;
    if (finalAmount <= 0) return;

    const updatedOrder = { ...showPaymentModal };
    const newPayment: PaymentRecord = {
      id: `PAY-${Math.random().toString(36).substr(2, 9)}`,
      amount: finalAmount,
      date: new Date().toLocaleDateString('fr-FR'),
      method: paymentMethod,
      reference: paymentRef,
      affectedProductIds: distributionMode === 'manual' ? Object.keys(manualDistribution).filter(k => manualDistribution[k] > 0) : []
    };

    updatedOrder.payments.push(newPayment);
    updatedOrder.paidAmount += finalAmount;

    if (distributionMode === 'auto') {
      let remainingPayment = finalAmount;
      updatedOrder.items = updatedOrder.items.map(item => {
        const itemTotal = item.quantity * item.unitPrice;
        const itemDebt = itemTotal - item.paidAmount;
        if (remainingPayment > 0 && itemDebt > 0) {
          const amountToApply = Math.min(remainingPayment, itemDebt);
          remainingPayment -= amountToApply;
          return { ...item, paidAmount: item.paidAmount + amountToApply };
        }
        return item;
      });
    } else {
      updatedOrder.items = updatedOrder.items.map(item => {
        const manualAmount = manualDistribution[item.productId] || 0;
        return { ...item, paidAmount: item.paidAmount + manualAmount };
      });
    }

    if (updatedOrder.paidAmount >= updatedOrder.totalAmount) {
      updatedOrder.status = 'paid';
    } else if (updatedOrder.paidAmount > 0) {
      updatedOrder.status = 'partially_paid';
    }

    onAddOrder(updatedOrder); 
    setShowPaymentModal(null);
    setPaymentAmount(0);
    setPaymentRef('');
    setManualDistribution({});
    setDistributionMode('auto');
  };

  const getStatusBadge = (order: Order) => {
    switch (order.status) {
      case 'paid':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase border border-emerald-200">Facture Soldée</span>;
      case 'partially_paid':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase border border-amber-200">Paiement Partiel</span>;
      default:
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase border border-rose-200">Non Soldée</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Finances & Facturation</h2>
          <p className="text-sm text-slate-500 font-medium">Suivi des règlements et émission de documents</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl flex items-center gap-3 hover:shadow-2xl hover:bg-indigo-700 transition-all font-black shadow-indigo-600/30 active:scale-95"
        >
          <Plus size={20} /> Nouvelle Vente
        </button>
      </div>

      {showCreate && (
        <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-100 shadow-2xl space-y-6 no-print animate-in slide-in-from-top-6 duration-500">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-slate-900 flex items-center gap-3 text-xl"><Plus size={24} className="text-indigo-600"/> Initialisation Commande</h3>
            <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-full transition-all"><X size={24}/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Sélection Client</label>
                <select 
                  className="w-full p-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">-- Choisir un compte client --</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Articles en Stock</label>
                <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-3 custom-scrollbar">
                  {products.filter(p => p.quantity > 0).map(p => (
                    <button 
                      key={p.id}
                      onClick={() => handleAddToCart(p.id)}
                      className="flex justify-between items-center p-5 rounded-[1.25rem] border border-slate-100 hover:border-indigo-500 hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                          <Package size={20}/>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">Dispo: {p.quantity} units | SKU: {p.sku}</p>
                        </div>
                      </div>
                      <span className="text-indigo-600 font-black text-lg">{p.price.toLocaleString()} FCFA</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[2.5rem] space-y-8 text-white shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
              <h4 className="font-black flex items-center gap-3 text-indigo-400 text-lg"><ShoppingCart size={24}/> Panier de Vente</h4>
              <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar">
                {cart.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 opacity-30">
                    <ShoppingCart size={48} className="mb-4"/>
                    <p className="text-sm italic">Votre panier est vide</p>
                  </div>
                )}
                {cart.map(item => {
                  const p = products.find(x => x.id === item.productId);
                  return (
                    <div key={item.productId} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                      <div>
                        <p className="font-black text-sm">{p?.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold italic">Quantité: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-indigo-300">{(item.quantity * item.unitPrice).toLocaleString()} FCFA</p>
                        <button onClick={() => setCart(prev => prev.filter(i => i.productId !== item.productId))} className="text-[8px] uppercase tracking-widest text-rose-400 hover:text-rose-300 font-black mt-1">Supprimer</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Net à payer</p>
                  <p className="text-5xl font-black text-white tracking-tighter">{cart.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0).toLocaleString()} FCFA</p>
                </div>
                <button 
                  onClick={createOrder} 
                  disabled={cart.length === 0 || !selectedClient}
                  className="bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:shadow-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[60] flex items-center justify-center p-4 no-print overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-8">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black flex items-center gap-3 text-xl"><CreditCard size={28} className="text-indigo-400"/> Enregistrement du Paiement</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Commande #{showPaymentModal.id}</p>
              </div>
              <button onClick={() => setShowPaymentModal(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24}/></button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Mode de Paiement</label>
                  <select 
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 outline-none"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN Money">MTN Money</option>
                    <option value="Wave Money">Wave Money</option>
                    <option value="Espèces">Espèces</option>
                    <option value="Virement Bancaire">Virement Bancaire</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Référence / Note</label>
                  <input 
                    type="text" 
                    placeholder="N° Transaction, Chèque..."
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Split size={14} className="text-indigo-600"/> Répartition des fonds
                  </h4>
                  <div className="flex bg-white rounded-xl p-1 border border-slate-200">
                    <button 
                      onClick={() => setDistributionMode('auto')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${distributionMode === 'auto' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
                    >
                      Automatique
                    </button>
                    <button 
                      onClick={() => setDistributionMode('manual')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${distributionMode === 'manual' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
                    >
                      Par Article
                    </button>
                  </div>
                </div>

                {distributionMode === 'auto' ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-medium">Les fonds seront affectés en priorité aux articles les plus anciens ou les moins réglés.</p>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 text-center">Somme Totale Perçue (FCFA)</label>
                      <input 
                        type="number" 
                        className="w-full text-center p-3 font-black text-3xl text-indigo-600 outline-none"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {showPaymentModal.items.map(item => {
                      const p = products.find(prod => prod.id === item.productId);
                      const totalItem = item.quantity * item.unitPrice;
                      const balance = totalItem - item.paidAmount;
                      return (
                        <div key={item.productId} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-black text-slate-900">{p?.name}</p>
                              <div className="flex gap-4 mt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Prix: {totalItem.toLocaleString()}</span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase">Payé: {item.paidAmount.toLocaleString()}</span>
                                <span className="text-[10px] font-black text-rose-500 uppercase">Dû: {balance.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="relative">
                              <input 
                                type="number" 
                                placeholder="Versement"
                                max={balance}
                                className="w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-right text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={manualDistribution[item.productId] || ''}
                                onChange={(e) => setManualDistribution({
                                  ...manualDistribution,
                                  [item.productId]: Math.min(balance, parseFloat(e.target.value) || 0)
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
                   <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total du Versement</p>
                      <p className="text-2xl font-black text-slate-900">
                        {(distributionMode === 'auto' ? paymentAmount : totalDistributed).toLocaleString()} FCFA
                      </p>
                   </div>
                   {distributionMode === 'manual' && (
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Articles concernés</p>
                        <p className="text-lg font-black text-indigo-600">
                          {/* Fixed type inference error for Object.values filter argument by explicitly typing v as a number */}
                          {Object.values(manualDistribution).filter((v: number) => v > 0).length} Ligne(s)
                        </p>
                     </div>
                   )}
                </div>
              </div>

              <button 
                onClick={handleAddPayment}
                disabled={(distributionMode === 'auto' ? paymentAmount : totalDistributed) <= 0}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-black shadow-xl transition-all disabled:opacity-20 active:scale-95 flex items-center justify-center gap-3"
              >
                <CheckCircle size={24}/> Confirmer l'Encaissement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders List View */}
      <div className="grid grid-cols-1 gap-6 no-print">
        {orders.map(order => {
          const client = clients.find(c => c.id === order.clientId);
          const balance = order.totalAmount - order.paidAmount;
          const hasDelivery = deliveries.some(d => d.orderId === order.id);
          
          return (
            <div key={order.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between hover:shadow-2xl transition-all group gap-8">
              <div className="flex items-center gap-8 flex-1">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${balance === 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
                  {balance === 0 ? <CheckCircle size={32}/> : <Banknote size={32}/>}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-black text-slate-900 text-xl tracking-tighter">{order.id}</span>
                    {getStatusBadge(order)}
                  </div>
                  <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-2 uppercase tracking-widest"><Users size={12}/> {client?.name || 'Inconnu'}</span>
                    <span className="flex items-center gap-2"><Calendar size={14}/> {order.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                   <p className="text-xl font-black text-slate-900">{order.totalAmount.toLocaleString()} FCFA</p>
                </div>
                <div className="flex items-center gap-3">
                  {!hasDelivery && (
                    <button 
                      onClick={() => handleShipOrder(order)}
                      className="p-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all"
                      title="Générer Expédition"
                    >
                      <Truck size={20}/>
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setShowPaymentModal(order);
                      setManualDistribution({});
                      setPaymentAmount(0);
                    }}
                    disabled={balance === 0}
                    className="p-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all disabled:opacity-20"
                    title="Encaisser"
                  >
                    <CreditCard size={20}/>
                  </button>
                  <button 
                    onClick={() => setShowInvoice(order)}
                    className="p-4 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all"
                    title="Facture"
                  >
                    <Printer size={20}/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[70] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-500 flex flex-col my-auto relative">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center shrink-0 border-b border-white/5 no-print">
              <div className="flex items-center gap-4">
                <FileText size={24} className="text-indigo-400"/>
                <h3 className="font-black tracking-widest uppercase text-sm">Document Commercial</h3>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.print()} 
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
                >
                  <Printer size={18}/> IMPRIMER
                </button>
                <button onClick={() => setShowInvoice(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={28}/></button>
              </div>
            </div>
            
            <div className="p-16 overflow-y-auto bg-white flex-1 custom-scrollbar">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <h1 className="text-4xl font-black text-indigo-600 uppercase tracking-tighter mb-2 italic">{storeConfig.name}</h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{storeConfig.slogan}</p>
                  <div className="mt-6 text-sm text-slate-500 space-y-1">
                    <p>{storeConfig.address}</p>
                    <p>{storeConfig.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-slate-900 text-white px-8 py-5 rounded-3xl mb-4">
                    <h2 className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">FACTURE</h2>
                    <p className="text-2xl font-black uppercase">#{showInvoice.id}</p>
                  </div>
                  <p className="text-sm font-black text-slate-900 uppercase">Date : {showInvoice.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-16">
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Destinataire</p>
                  <p className="text-2xl font-black text-slate-900 mb-1">{clients.find(c => c.id === showInvoice.clientId)?.name}</p>
                  <p className="text-sm font-bold text-indigo-600 mb-4">{clients.find(c => c.id === showInvoice.clientId)?.company || 'Particulier'}</p>
                  <p className="text-xs text-slate-500">{clients.find(c => c.id === showInvoice.clientId)?.address}</p>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Total Brut</span>
                    <span className="font-black text-slate-900">{showInvoice.totalAmount.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Total Réglé</span>
                    <span className="font-black text-emerald-600">-{showInvoice.paidAmount.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                    <span className="text-xs font-black uppercase tracking-widest">Net à Payer</span>
                    <span className="text-3xl font-black text-rose-600">{(showInvoice.totalAmount - showInvoice.paidAmount).toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <table className="w-full mb-12 border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-left rounded-tl-2xl">Désignation</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-center">Qté</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-right rounded-tr-2xl">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border-x border-slate-100">
                  {showInvoice.items.map(item => (
                    <tr key={item.productId}>
                      <td className="py-4 px-6">
                        <p className="font-black text-slate-900">{products.find(p => p.id === item.productId)?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{products.find(p => p.id === item.productId)?.sku}</p>
                      </td>
                      <td className="py-4 px-6 text-center font-black">{item.quantity}</td>
                      <td className="py-4 px-6 text-right font-black">{(item.quantity * item.unitPrice).toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Historique des paiements par date */}
              {showInvoice.payments.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Historique des Règlements</h4>
                  <div className="space-y-2">
                    {showInvoice.payments.map((p, i) => (
                      <div key={i} className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-500">{p.date}</span>
                          <span className="font-black text-slate-900">{p.method}</span>
                          {p.reference && <span className="text-[10px] text-slate-400 font-mono">Ref: {p.reference}</span>}
                        </div>
                        <span className="font-black text-emerald-600">+{p.amount.toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center pt-10 border-t border-slate-100 mt-12">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Merci pour votre confiance - Document généré par StockMaster Pro</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
