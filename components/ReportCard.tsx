import React from 'react';
import { PredictionResult, WeightUnit } from '../types';
import { 
  Ruler, Weight, ClipboardCheck, Sparkles, ShieldCheck, 
  Zap, Terminal, Database, Lightbulb, Activity, Info, Target
} from 'lucide-react';

interface ReportCardProps {
  result: PredictionResult;
  weightUnit: WeightUnit;
}

const ReportCard: React.FC<ReportCardProps> = ({ result, weightUnit }) => {
  const dateStr = new Date(result.timestamp).toLocaleDateString();
  const timeStr = new Date(result.timestamp).toLocaleTimeString();
  
  const weightInKg = weightUnit === 'kg' ? result.weight : result.weight * 0.453592;
  const weightInLbs = weightUnit === 'lbs' ? result.weight : result.weight * 2.20462;
  const dimUnit = result.units === 'imperial' ? 'in' : 'cm';

  const herbSupplement = result.feedSuggestions.find(f => f.type === "Plantain Herb Supplement");

  return (
    <div id="bovine-report" className="w-full max-w-[850px] mx-auto bg-[#050505] text-white p-6 md:p-12 relative overflow-hidden font-inter border-2 md:border-4 border-white/10 shadow-2xl">
      
      {/* Neural Background Texture */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none font-mono text-[7px] overflow-hidden p-4">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap">CORE_NODE_IDX_{i}_NEURAL_SYNC_ACTIVE_AAS_BAU_SYSTEM_LOG_{result.timestamp}</div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 md:mb-12 relative z-10 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 md:p-3 rounded-2xl shadow-lg shadow-blue-600/30">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none">Smart Herbo</h1>
            <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] mt-1">BAU Neural Analytics</p>
          </div>
        </div>
        <div className="sm:text-right w-full sm:w-auto">
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-md mb-1">
            <Terminal className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-mono font-bold text-white/70 tracking-tighter">BAU_{result.timestamp.toString().slice(-6).toUpperCase()}</span>
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] block">{dateStr} // {timeStr}</p>
        </div>
      </div>

      <div className="space-y-6 md:space-y-10 relative z-10">
        
        {/* SECTION 1: VALIDATION BIOMETRIC MAP */}
        <section className="bg-white/5 border border-white/10 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8">
          <div className="flex items-center gap-2 mb-6 md:mb-8 text-white/40">
            <Ruler className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em]">Validation: Biometric Map</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Image Box */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-900 border border-white/10 shadow-2xl">
              <img src={result.image} className="w-full h-full object-cover" alt="Validated Scan" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-3 right-3 bg-black/80 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-2 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-tighter">Scan Verified</span>
              </div>
            </div>

            {/* Dimension Stats */}
            <div className="lg:col-span-7 space-y-4 md:space-y-5">
              {[
                { label: 'Shoulder Height', val: result.dimensions.height },
                { label: 'Body Length', val: result.dimensions.length },
                { label: 'Heart Girth', val: result.dimensions.heartGirth }
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[9px] md:text-[10px] text-white/40 uppercase font-black tracking-widest">{item.label}</span>
                    <div className="text-right">
                      <span className="text-2xl md:text-3xl font-black font-mono leading-none group-hover:text-blue-400 transition-colors">{item.val}</span>
                      <span className="text-[9px] md:text-[10px] font-bold text-white/20 ml-1 uppercase">{dimUnit}</span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 opacity-60" style={{ width: `${Math.min((item.val / 150) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: ESTIMATED BODY WEIGHT */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-xl relative overflow-hidden border-b-8 border-blue-900">
          <Sparkles className="absolute top-[-20px] right-[-20px] w-32 md:w-48 h-32 md:h-48 opacity-10" />
          <div className="flex items-center gap-2 mb-4 md:mb-6 opacity-80">
            <Weight className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em]">Primary Metric: Estimated Body Weight</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <h2 className="text-6xl sm:text-7xl md:text-[9rem] font-black text-white leading-[0.85] tracking-tighter">
              {weightInKg.toFixed(1)}<span className="text-2xl md:text-4xl font-light ml-2 md:ml-3 opacity-40 uppercase">kg</span>
            </h2>
            <div className="flex items-center gap-2 md:gap-4 mt-4">
               <div className="h-px flex-grow bg-white/20" />
               <p className="text-lg md:text-3xl font-bold text-blue-100/90 whitespace-nowrap italic">
                 ≈ {weightInLbs.toFixed(1)} <span className="text-sm md:text-lg font-medium opacity-50 uppercase tracking-tighter ml-1">lbs (Imperial Equiv.)</span>
              </p>
               <div className="h-px flex-grow bg-white/20" />
            </div>
          </div>

          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-wrap gap-6 md:gap-10">
              {/* Metabolic Block */}
              <div>
                <p className="text-[8px] md:text-[9px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-1">Metabolic Factor (BW^0.75)</p>
                <p className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">{result.metabolicWeight.toFixed(2)}</p>
              </div>
              
              {/* NEW: Confidence Block */}
              <div className="border-l border-white/10 pl-6">
                <p className="text-[8px] md:text-[9px] font-black text-emerald-400/50 uppercase tracking-[0.2em] mb-1">Inference Confidence</p>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <p className="text-3xl md:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                    {(result.confidence * 100).toFixed(1)}<span className="text-sm opacity-60">%</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:block bg-white/10 border border-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                <Activity className="w-5 h-5 text-blue-300 animate-pulse" />
            </div>
          </div>
        </section>

        {/* SECTION 3: NUTRITIONAL PRESCRIPTION */}
        <section className="bg-emerald-500/5 border-2 border-emerald-500/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6 md:mb-8 text-emerald-400">
            <ClipboardCheck className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em]">Nutritional Prescription</span>
          </div>

          {herbSupplement && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight">{herbSupplement.type}</h3>
                  <div className="mt-2 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/30 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                    <Info className="w-3 h-3" />
                    Metabolic Scaled Protocol
                  </div>
                </div>
                <div className="text-right bg-black/40 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/5 w-full md:w-auto">
                  <span className="text-5xl md:text-7xl font-black text-white block leading-none">{herbSupplement.amount.toFixed(1)}</span>
                  <span className="text-[10px] md:text-xs font-bold text-emerald-500 uppercase tracking-[0.4em] mt-1 block">{herbSupplement.unit}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white/5 flex gap-4 md:gap-5">
                  <Database className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 shrink-0 mt-1" />
                  <div className="space-y-3">
                    <p className="text-xs md:text-[13px] text-white/80 leading-relaxed font-medium">
                      {herbSupplement.description}
                    </p>
                    <div className="h-px bg-white/10 w-full" />
                    <p className="text-[9px] md:text-[11px] text-emerald-400/70 font-bold uppercase tracking-wider">
                      Scaling Logic: {herbSupplement.amount.toFixed(1)}g calculated via (Metabolic BW / Baseline Unit) × Target Ratio.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-400/5 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-yellow-400/10 relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="bg-yellow-400/20 p-2 rounded-lg">
                        <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                    </div>
                    <span className="text-[10px] md:text-xs font-black text-yellow-400 uppercase tracking-[0.3em]">Smart Analytics Tips</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                    {[
                      { text: "Mix with morning concentrate for ", highlight: "max absorption" },
                      { text: "Natural ", highlight: "Aucubin", after: " supports healthy gut lining." },
                      { text: "Enhances nutrient uptake efficiency by ", highlight: "~12.4%" },
                      { text: "Anti-inflammatory properties shield ", highlight: "rumen health" }
                    ].map((tip, i) => (
                      <li key={i} className="text-[11px] md:text-[12px] text-yellow-100/70 flex gap-2">
                        <span className="text-yellow-400 font-bold">»</span> 
                        <span>
                          {tip.text}<strong className="text-yellow-400 font-black">{tip.highlight}</strong>{tip.after}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>

      </div>

      {/* Footer */}
      <div className="mt-12 md:mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-40">
        <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em]">
          <Activity className="w-4 h-4 text-blue-500" />
          <span>Neural Engine v4.2 // BAU_AGRO_SYS_LOG</span>
        </div>
        <div className="text-center sm:text-right">
            <span className="text-[9px] font-mono tracking-tighter italic">| AAS_BAU_{result.timestamp.toString(36).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;