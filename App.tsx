import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera as CameraIcon, 
  Upload, 
  BarChart3, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Zap,
  ShieldCheck,
  Cpu,
  Globe,
  Fingerprint,
  Activity,
  HelpCircle,
  FileText,
  // Icons from ReportCard
  Ruler, 
  Weight, 
  ClipboardCheck, 
  Sparkles, 
  Terminal, 
  Database, 
  Lightbulb, 
  Info,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnitSystem, WeightUnit, CattleDimensions, PredictionResult } from './types';
import { 
  validateDimensions, 
  calculateMetabolicWeight, 
  getFeedSuggestions,
  formatWeight 
} from './services/calculationService';
import { loadBovineModel, predictWeight, validateCattlePresence, IMG_WIDTH, IMG_HEIGHT } from './services/tfjsService';
import CameraModule from './components/CameraModule';
import FuturisticInput from './components/FuturisticInput';
import ReportCard from './components/ReportCard';
import OnboardingTutorial from './components/OnboardingTutorial';

const STORAGE_KEY = 'bovinemetric_history';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [step, setStep] = useState<'form' | 'processing' | 'result'>('form');
  const [processingSubStep, setProcessingSubStep] = useState<'verifying' | 'inferring'>('verifying');
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [units, setUnits] = useState<UnitSystem>('imperial');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lbs');
  const [dimensions, setDimensions] = useState<CattleDimensions>({ height: 0, length: 0, heartGirth: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExportPreview, setShowExportPreview] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const initApp = async () => {
      const loaded = await loadBovineModel();
      setModelLoaded(loaded);
      setTimeout(() => setIsInitializing(false), 1500);
    };
    initApp();
    
    const hasOnboarded = localStorage.getItem('bovinemetric_onboarded');
    if (!hasOnboarded) setShowTutorial(true);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ global: "Invalid file type. Please upload a standard image." });
        return;
      }
      setUploadProgress(10);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setUploadProgress(100);
        setErrors({});
        setTimeout(() => setUploadProgress(0), 300);
      };
      reader.onerror = () => {
        setErrors({ global: "Image upload failed. Try another file." });
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleUnitSystem = (system: UnitSystem) => {
    setUnits(system);
    setWeightUnit(system === 'imperial' ? 'lbs' : 'kg');
  };

  const handlePredict = async () => {
    const validation = validateDimensions(dimensions);
    if (!validation.isValid) {
      setErrors({ global: validation.error || "Invalid dimensions provided." });
      return;
    }
    
    const currentImage = image;
    if (!currentImage) return;

    setErrors({});
    setStep('processing');
    setProcessingSubStep('verifying');

    try {
      // Step 1: Bovine Presence Verification
      const presenceValidation = await validateCattlePresence(currentImage);
      if (!presenceValidation.isValid) {
        setStep('form');
        setErrors({ global: presenceValidation.reason });
        return;
      }

      await new Promise(r => setTimeout(r, 800));
      setProcessingSubStep('inferring');
      
      const prediction = await predictWeight(dimensions, currentImage, units === 'metric');
      
      const metabolicWeight = calculateMetabolicWeight(prediction.weight);
      const feed = getFeedSuggestions(prediction.weight, metabolicWeight);

      const finalResult: PredictionResult = {
        ...prediction,
        metabolicWeight,
        feedSuggestions: feed,
        timestamp: Date.now(),
        image: currentImage,
        dimensions,
        units
      };

      setResult(finalResult);
      setTimeout(() => setStep('result'), 800);
    } catch (err: any) {
      console.error("Prediction error:", err);
      setStep('form');
      setErrors({ global: err.message || "Analysis Core Error. Check sensor data and try again." });
    }
  };

  const reset = () => {
    setStep('form');
    setImage(null);
    setDimensions({ height: 0, length: 0, heartGirth: 0 });
    setResult(null);
    setErrors({});
  };

  const canPredict = dimensions.height > 0 && dimensions.length > 0 && dimensions.heartGirth > 0 && image && !uploadProgress;

  // Helper variables for result view
  const getResultDisplayData = () => {
    if (!result) return null;
    const dateStr = new Date(result.timestamp).toLocaleDateString();
    const timeStr = new Date(result.timestamp).toLocaleTimeString();
    const weightInKg = weightUnit === 'kg' ? result.weight : result.weight * 0.453592;
    const weightInLbs = weightUnit === 'lbs' ? result.weight : result.weight * 2.20462;
    const dimUnit = result.units === 'imperial' ? 'in' : 'cm';
    const herbSupplement = result.feedSuggestions.find(f => f.type === "Plantain Herb Supplement");
    
    return { dateStr, timeStr, weightInKg, weightInLbs, dimUnit, herbSupplement };
  };

  const resultData = getResultDisplayData();

  return (
    <div className="min-h-screen pb-20 max-w-lg mx-auto px-4 md:px-0 relative">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Hidden container for Report Preview */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0', pointerEvents: 'none' }}>
        {result && (
          <div ref={reportRef}>
            <ReportCard result={result} weightUnit={weightUnit} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isInitializing && (
          <motion.div 
            key="initializer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-8 text-center"
          >
            <Zap className="w-16 h-16 text-blue-500 animate-pulse mb-8" />
            <h2 className="text-3xl font-black tracking-tight font-futuristic uppercase italic">
              Smart Herbo <span className="text-blue-500">Analytics</span>
            </h2>
            <div className="mt-8 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-white/20 animate-spin" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">Syncing Local Neural Core</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="py-8 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl glow-primary cursor-pointer active:scale-95 transition-all" onClick={reset}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">Smart Herbo <span className="text-blue-500">Analytics</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 glass ml-1">
            <button onClick={() => toggleUnitSystem('imperial')} className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${units === 'imperial' ? 'bg-blue-600 text-white' : 'text-white/40'}`}>Imp</button>
            <button onClick={() => toggleUnitSystem('metric')} className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${units === 'metric' ? 'bg-blue-600 text-white' : 'text-white/40'}`}>Met</button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!image ? (
                <div className="space-y-8">
                  <h2 className="text-4xl font-bold leading-tight">Biometric Cattle <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Weight Analytics.</span></h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setIsCameraOpen(true)} className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-blue-600/10 transition-all active:scale-95"><CameraIcon className="w-6 h-6 text-blue-400" /><span className="text-[10px] font-black uppercase tracking-widest">Capture</span></button>
                    <label className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-blue-600/10 cursor-pointer transition-all active:scale-95"><input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} /><Upload className="w-6 h-6 text-emerald-400" /><span className="text-[10px] font-black uppercase tracking-widest">Import</span></label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center"><button onClick={reset} className="text-white/40 hover:text-white text-xs font-black uppercase tracking-widest transition-all">Reset Scan</button></div>
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[4/3] bg-neutral-900 shadow-2xl group">
                    <img ref={previewImageRef} src={image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Biometric Preview" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none" />
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    <FuturisticInput label="Shoulder Height" value={dimensions.height ? String(dimensions.height) : ''} onChange={(v) => setDimensions({...dimensions, height: Number(v)})} unit={units === 'imperial' ? 'in' : 'cm'} error={!!errors.global && dimensions.height <= 0} />
                    <FuturisticInput label="Body Length" value={dimensions.length ? String(dimensions.length) : ''} onChange={(v) => setDimensions({...dimensions, length: Number(v)})} unit={units === 'imperial' ? 'in' : 'cm'} error={!!errors.global && dimensions.length <= 0} />
                    <FuturisticInput label="Heart Girth" value={dimensions.heartGirth ? String(dimensions.heartGirth) : ''} onChange={(v) => setDimensions({...dimensions, heartGirth: Number(v)})} unit={units === 'imperial' ? 'in' : 'cm'} error={!!errors.global && dimensions.heartGirth <= 0} />
                  </div>
                  {errors.global && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex gap-3"><AlertCircle className="w-4 h-4 shrink-0" />{errors.global}</motion.div>}
                  <button onClick={handlePredict} disabled={!canPredict} className={`w-full py-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${canPredict ? 'bg-blue-600 hover:bg-blue-500' : 'bg-white/5 text-white/20'}`}>Initiate Neural Analysis <BarChart3 className="w-5 h-5" /></button>
                </div>
              )}
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 space-y-8 text-center">
              <div className="relative"><Loader2 className="w-16 h-16 text-blue-500 animate-spin" /><ShieldCheck className="absolute inset-0 m-auto w-6 h-6 text-blue-300" /></div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold uppercase tracking-tight italic font-futuristic">{processingSubStep === 'verifying' ? 'Local Biometric Scan' : 'Morphology Inference'}</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">{processingSubStep === 'verifying' ? 'Executing 3-Tier validation on local subject data...' : 'Extracting feature weights from high-resolution local neural map...'}</p>
              </div>
            </motion.div>
          )}

          {step === 'result' && result && resultData && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-10">
              
              {/* --- INTEGRATED REPORT CARD UI START --- */}
              <div className="w-full bg-[#050505] text-white p-6 relative overflow-hidden font-inter border border-white/10 shadow-2xl rounded-3xl">
                
                {/* Neural Background Texture */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none font-mono text-[6px] overflow-hidden p-3">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i}>CORE_NODE_IDX_{i}_NEURAL_SYNC_ACTIVE_AAS_BAU_SYSTEM_LOG_{result.timestamp}</div>
                  ))}
                </div>

                {/* Report Header */}
                <div className="flex justify-between items-start mb-8 relative z-10 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30">
                      <Zap className="w-5 h-5 text-white fill-current" />
                    </div>
                    <div>
                      <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Smart Herbo</h1>
                      <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-[8px] mt-1">BAU Neural Analytics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded-md mb-1">
                      <Terminal className="w-2 h-2 text-blue-400" />
                      <span className="text-[8px] font-mono font-bold text-white/70 tracking-tighter">BAU_{result.timestamp.toString().slice(-6).toUpperCase()}</span>
                    </div>
                    <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] block">{resultData.dateStr}</p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  
                  {/* SECTION 1: VALIDATION BIOMETRIC MAP */}
                  <section className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-4 text-white/40">
                      <Ruler className="w-4 h-4 text-blue-500" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Validation: Biometric Map</span>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {/* Image Box */}
                      <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-neutral-900 border border-white/10 shadow-xl">
                        <img src={result.image} className="w-full h-full object-cover" alt="Validated Scan" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1 backdrop-blur-md">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span className="text-[7px] font-black uppercase text-emerald-400 tracking-tighter">Scan Verified</span>
                        </div>
                      </div>

                      {/* Dimension Stats */}
                      <div className="space-y-3">
                        {[
                          { label: 'Shoulder Height', val: result.dimensions.height },
                          { label: 'Body Length', val: result.dimensions.length },
                          { label: 'Heart Girth', val: result.dimensions.heartGirth }
                        ].map((item, i) => (
                          <div key={i} className="group">
                            <div className="flex justify-between items-end mb-1">
                              <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">{item.label}</span>
                              <div className="text-right">
                                <span className="text-2xl font-black font-mono leading-none group-hover:text-blue-400 transition-colors">{item.val}</span>
                                <span className="text-[8px] font-bold text-white/20 ml-1 uppercase">{resultData.dimUnit}</span>
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
                  <section className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-2xl p-4 shadow-xl relative overflow-hidden border-b-4 border-blue-900">
                    <Sparkles className="absolute top-[-10px] right-[-10px] w-24 h-24 opacity-10" />
                    <div className="flex items-center gap-2 mb-3 opacity-80">
                      <Weight className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Primary Metric: Estimated Body Weight</span>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <h2 className="text-6xl font-black text-white leading-[0.85] tracking-tighter">
                        {resultData.weightInKg.toFixed(1)}<span className="text-xl font-light ml-2 opacity-40 uppercase">kg</span>
                      </h2>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-px flex-grow bg-white/20" />
                        <p className="text-lg font-bold text-blue-100/90 whitespace-nowrap italic">
                          ≈ {resultData.weightInLbs.toFixed(1)} <span className="text-xs font-medium opacity-50 uppercase tracking-tighter ml-1">lbs</span>
                        </p>
                        <div className="h-px flex-grow bg-white/20" />
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                      <div className="flex flex-wrap gap-4">
                        {/* Metabolic Block */}
                        <div>
                          <p className="text-[7px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-1">Metabolic Factor (BW^0.75)</p>
                          <p className="text-2xl font-black text-white font-mono tracking-tight">{result.metabolicWeight.toFixed(2)}</p>
                        </div>
                        
                        {/* UPDATED: Inference Confidence Block matching ReportCard.tsx */}
                        <div className="border-l border-white/10 pl-4">
                          <p className="text-[7px] font-black text-emerald-400/50 uppercase tracking-[0.2em] mb-1">Inference Confidence</p>
                          <div className="flex items-center gap-2">
                            <Target className="w-3 h-3 text-emerald-400" />
                            <p className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                              {(result.confidence * 100).toFixed(1)}<span className="text-xs opacity-60">%</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 border border-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                        <Activity className="w-4 h-4 text-blue-300 animate-pulse" />
                      </div>
                    </div>
                  </section>

                  {/* SECTION 3: NUTRITIONAL PRESCRIPTION */}
                  <section className="bg-emerald-500/5 border-2 border-emerald-500/10 rounded-2xl p-4 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400">
                      <ClipboardCheck className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Nutritional Prescription</span>
                    </div>

                    {resultData.herbSupplement && (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-2xl font-black text-white uppercase leading-tight">{resultData.herbSupplement.type}</h3>
                                <div className="mt-1 inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30 text-[7px] font-black uppercase tracking-widest">
                                  <Info className="w-2 h-2" />
                                  Metabolic Scaled
                                </div>
                             </div>
                             <div className="text-right bg-black/40 p-3 rounded-xl border border-white/5">
                                <span className="text-4xl font-black text-white block leading-none">{resultData.herbSupplement.amount.toFixed(1)}</span>
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.3em] mt-1 block">{resultData.herbSupplement.unit}</span>
                             </div>
                          </div>

                          <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex gap-3">
                            <Database className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                            <div className="space-y-2">
                              <p className="text-[11px] text-white/80 leading-relaxed font-medium">
                                {resultData.herbSupplement.description}
                              </p>
                              <div className="h-px bg-white/10 w-full" />
                              <p className="text-[8px] text-emerald-400/70 font-bold uppercase tracking-wider">
                                Logic: (Metabolic BW / Base) × Ratio.
                              </p>
                            </div>
                          </div>
                          
                          {/* Tips Section */}
                          <div className="bg-yellow-400/5 rounded-xl p-3 border border-yellow-400/10 relative">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="bg-yellow-400/20 p-1.5 rounded">
                                <Lightbulb className="w-3 h-3 text-yellow-400" />
                              </div>
                              <span className="text-[9px] font-black text-yellow-400 uppercase tracking-[0.3em]">Smart Analytics Tips</span>
                            </div>
                            <ul className="grid grid-cols-1 gap-1">
                              <li className="text-[9px] text-yellow-100/70 flex gap-1">
                                <span className="text-yellow-400 font-bold">»</span> 
                                <span>Mix with morning concentrate for <strong className="text-yellow-400 font-black">max absorption</strong>.</span>
                              </li>
                              <li className="text-[9px] text-yellow-100/70 flex gap-1">
                                <span className="text-yellow-400 font-bold">»</span> 
                                <span>Enhances nutrient uptake efficiency by <strong className="text-yellow-400 font-black">~12.4%</strong>.</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
                  <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.4em]">
                    <Activity className="w-3 h-3 text-blue-500" />
                    <span>Neural Engine v4.2</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-mono tracking-tighter italic">| AAS_BAU_{result.timestamp.toString(36).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              {/* --- INTEGRATED REPORT CARD UI END --- */}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setShowExportPreview(true)} 
                  className="bg-white/5 border border-white/10 py-4 rounded-2xl text-white/80 font-black uppercase text-[9px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                >
                  <FileText className="w-4 h-4" /> Preview Full Report
                </button>
                <button 
                  onClick={reset} 
                  className="bg-white/5 border border-white/10 py-4 rounded-2xl text-white/40 font-black uppercase text-[9px] tracking-[0.3em] hover:bg-white/10 transition-all active:scale-95"
                >
                  New Analysis Protocol
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isCameraOpen && <CameraModule onCapture={(img) => { setImage(img); setIsCameraOpen(false); }} onClose={() => setIsCameraOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showExportPreview && result && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-neutral-900 w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col max-h-[92vh] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)]">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]">
                <h2 className="text-xl font-bold uppercase tracking-tighter italic">Neural Analytics <strong className="text-blue-400">Report</strong></h2>
                <button onClick={() => setShowExportPreview(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all"><RotateCcw className="w-5 h-5 text-white/60" /></button>
              </div>
              <div className="flex-1 overflow-auto p-6 flex justify-center bg-[#000] scrollbar-hide">
                <div className="scale-[0.4] sm:scale-[0.5] md:scale-100 origin-top h-fit border-4 border-white/5 rounded">
                  <ReportCard result={result} weightUnit={weightUnit} />
                </div>
              </div>
              <div className="p-6 border-t border-white/5 flex gap-3 bg-[#050505]">
                 <button onClick={() => setShowExportPreview(false)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest">Close Preview</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showTutorial && <OnboardingTutorial onClose={() => { setShowTutorial(false); localStorage.setItem('bovinemetric_onboarded', 'true'); }} />}</AnimatePresence>
    </div>
  );
}