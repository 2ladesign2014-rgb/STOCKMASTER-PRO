
import React from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Database, 
  Package, 
  Banknote, 
  Zap, 
  Printer, 
  WifiOff, 
  Lock,
  ArrowRight,
  Monitor,
  Download
} from 'lucide-react';

const UserGuide: React.FC = () => {
  const sections = [
    {
      title: "Installation Windows",
      icon: Monitor,
      color: "text-blue-600",
      bg: "bg-blue-50",
      steps: [
        "Navigateur : Utilisez Chrome ou Edge pour une compatibilité maximale.",
        "Installer : Cliquez sur l'icône '+' ou 'Installer' dans la barre d'adresse en haut à droite.",
        "Épingler : Une fois installée, faites un clic droit sur l'icône dans la barre des tâches > Épingler.",
        "Accès : Vous pouvez maintenant lancer l'ERP comme un logiciel Windows classique, même sans internet."
      ]
    },
    {
      title: "Gestion de l'Inventaire",
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      steps: [
        "Catalogue : Enregistrez vos articles avec SKU unique dans Configuration > Catalogue.",
        "Stock : Ajustez les quantités via les boutons + / - dans la vue Inventaire.",
        "Alertes : Surveillez les pastilles orange/rouge indiquant les seuils critiques.",
        "Rapports : Générez des fiches d'audit physique via le bouton 'Imprimer Rapport'."
      ]
    },
    {
      title: "Facturation & CRM",
      icon: Banknote,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      steps: [
        "Ventes : Sélectionnez un client, ajoutez les produits au panier et validez.",
        "Paiements : Enregistrez les règlements (Orange, Wave, Espèces) pour chaque facture.",
        "Créances : Suivez le 'Reste à Payer' des clients directement dans l'onglet Clients CRM.",
        "Documents : Imprimez des factures professionnelles avec logo et conditions de règlement."
      ]
    },
    {
      title: "Sauvegarde des Données",
      icon: Database,
      color: "text-amber-600",
      bg: "bg-amber-50",
      steps: [
        "Stockage Local : Vos données restent sur ce PC. Aucune donnée n'est envoyée dans le cloud.",
        "Export JSON : Allez dans Configuration > Maintenance pour télécharger votre sauvegarde.",
        "Fréquence : Nous recommandons une sauvegarde quotidienne sur une clé USB externe.",
        "Restauration : En cas de changement de PC, importez simplement votre dernier fichier .json."
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <BookOpen size={40} className="text-indigo-600"/>
          Manuel d'Utilisation Expert
        </h2>
        <p className="text-slate-500 font-medium text-lg">Guide complet pour maîtriser votre ERP StockMaster Pro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
            <div className={`p-8 ${section.bg} border-b border-slate-100 flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-white rounded-2xl shadow-sm ${section.color}`}>
                  <section.icon size={24} />
                </div>
                <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">{section.title}</h3>
              </div>
              <ArrowRight className="text-slate-300 group-hover:translate-x-2 transition-transform" />
            </div>
            <div className="p-8 space-y-6">
              {section.steps.map((step, sIdx) => (
                <div key={sIdx} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-[10px] font-black">{sIdx + 1}</div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10 animate-pulse"><Zap size={120}/></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 bg-indigo-500/20 rounded-[2.5rem] flex items-center justify-center border-2 border-indigo-500/30">
            <WifiOff size={48} className="text-indigo-300"/>
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-black italic">Philosophie de l'Application</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              StockMaster Pro est conçu pour être **totalement autonome**. 
              Vos données ne dépendent d'aucun serveur distant, garantissant une confidentialité totale et une rapidité d'exécution sans égal, même en zone blanche.
            </p>
            <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest bg-emerald-500/10 w-fit px-4 py-2 rounded-full">
              <ShieldCheck size={16}/> Protection des Données Locale Active
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 no-print">
        <button onClick={() => window.print()} className="flex items-center gap-3 bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
          <Printer size={20}/> Imprimer ce Guide
        </button>
      </div>
    </div>
  );
};

export default UserGuide;
