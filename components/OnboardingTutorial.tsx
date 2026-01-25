import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Zap, X, ChevronRight, ChevronLeft, CheckCircle2, ShieldOff } from 'lucide-react';

interface OnboardingTutorialProps {
  onClose: () => void;
}

const steps = [
  {
    title: "Smart Herbo Analytics",
    description: "Precision weight analysis and nutritional guidance powered by a local EfficientNet neural core. Completely private and offline.",
    icon: <Zap className="w-12 h-12 text-blue-400" />,
    color: "from-blue-600 to-cyan-500"
  },
  {
    title: "100% Offline Core",
    description: "No servers, no cloud, no APIs. All biometric verification and calculations happen directly on your device's hardware.",
    icon: <ShieldOff className="w-12 h-12 text-blue-400" />,
    color: "from-indigo-600 to-blue-500"
  },
  {
    title: "Vision Verification",
    description: "Our local AI ensures the subject matches bovine morphology before calculation, preventing non-cattle data entry.",
    icon: <CheckCircle2 className="w-12 h-12 text-emerald-400" />,
    color: "from-emerald-600 to-blue-500"
  },
  {
    title: "Biometric Dimensions",
    description: "Input precise measurements. Toggle between Metric and Imperial systems instantly from the dashboard.",
    icon: <Ruler className="w-12 h-12 text-blue-400" />,
    color: "from-blue-500 to-indigo-500"
  }
];

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 flex">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 transition-all duration-500 ${i <= currentStep ? 'bg-blue-600' : 'bg-white/5'}`} />
          ))}
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10">
          <X className="w-4 h-4 text-white/40" />
        </button>

        <div className="p-10 pt-16">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="relative inline-block">
                <div className={`absolute -inset-4 bg-gradient-to-br ${steps[currentStep].color} opacity-20 blur-2xl rounded-full`} />
                <div className="relative">{steps[currentStep].icon}</div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-black font-futuristic tracking-tight leading-tight">{steps[currentStep].title}</h2>
                <p className="text-white/50 text-lg leading-relaxed">{steps[currentStep].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div 
            layout 
            className={`mt-12 flex items-center gap-4 transition-all duration-500 ${currentStep === 0 ? 'justify-center' : 'justify-between'}`}
          >
            {currentStep > 0 && (
              <button onClick={prev} className="p-4 rounded-2xl border border-white/10 transition-all hover:bg-white/5">
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </button>
            )}

            <motion.button 
              layout
              onClick={next}
              className={`py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest text-xs ${currentStep === 0 ? 'px-10' : 'flex-1'}`}
            >
              {currentStep === steps.length - 1 ? (
                <>Initialize Engine <CheckCircle2 className="w-4 h-4" /></>
              ) : (
                <>Continue <ChevronRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </motion.div>

          <button onClick={onClose} className="w-full mt-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white/40">
            Skip Instruction
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingTutorial;