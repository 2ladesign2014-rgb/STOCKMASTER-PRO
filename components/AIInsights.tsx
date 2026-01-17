
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getSmartStockInsights } from '../services/geminiService';
import { Sparkles, BrainCircuit, RefreshCw, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface Props {
  products: Product[];
}

const AIInsights: React.FC<Props> = ({ products }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getSmartStockInsights(products);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Moteur d'Intelligence Artificielle</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Analyse Prédictive de Stock</h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            StockMaster Pro utilise Gemini 3 pour analyser vos tendances d'inventaire, 
            identifier les anomalies et suggérer des actions de réapprovisionnement intelligentes.
          </p>
          <button 
            onClick={fetchInsights}
            disabled={loading}
            className="mt-8 bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50 active:scale-95 shadow-xl"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
            {loading ? 'Analyse en cours...' : 'Relancer l\'analyse IA'}
          </button>
        </div>
        
        {/* Abstract shapes for design */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><CheckCircle2 /></div>
          <div>
            <h4 className="font-bold text-slate-900">Optimisation</h4>
            <p className="text-sm text-slate-500 mt-1">Vitesse de rotation des stocks améliorée de 15%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><AlertTriangle /></div>
          <div>
            <h4 className="font-bold text-slate-900">Prévention</h4>
            <p className="text-sm text-slate-500 mt-1">2 ruptures potentielles évitées cette semaine</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Lightbulb /></div>
          <div>
            <h4 className="font-bold text-slate-900">Trésorerie</h4>
            <p className="text-sm text-slate-500 mt-1">Capital dormant réduit de 2,400€ suggéré</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="border-b border-slate-100 p-6 bg-slate-50/50 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
          <h3 className="font-bold text-slate-900">Rapport d'Analyse Stratégique</h3>
        </div>
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <RefreshCw className="text-indigo-600 animate-spin" size={48} />
              <p className="text-slate-500 font-medium">L'IA parcourt vos données...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium bg-indigo-50/30 p-8 rounded-2xl border border-indigo-100/50">
                {insight || "Cliquez sur 'Relancer l'analyse' pour générer un rapport."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
