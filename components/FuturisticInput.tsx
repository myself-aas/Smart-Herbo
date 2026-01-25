
import React from 'react';
import { motion } from 'framer-motion';

interface FuturisticInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  unit: string;
  placeholder?: string;
  error?: boolean;
}

const FuturisticInput: React.FC<FuturisticInputProps> = ({ label, value, onChange, unit, placeholder, error }) => {
  return (
    <div className="relative group">
      <label className="block text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-black/60 border-2 ${error ? 'border-red-500/50' : 'border-white/10'} 
            group-hover:border-blue-500/30 rounded-xl px-4 py-3.5 outline-none 
            transition-all duration-300 text-lg font-medium font-futuristic pr-12
            focus:border-transparent relative z-10`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold pointer-events-none z-20">
          {unit}
        </div>
        
        {/* Pulsating, neon-like glow effect on focus */}
        <motion.div 
          className="absolute -inset-[2px] rounded-xl pointer-events-none opacity-0 group-focus-within:opacity-100 z-0"
          animate={{
            boxShadow: [
              '0 0 10px rgba(59, 130, 246, 0.5), inset 0 0 5px rgba(59, 130, 246, 0.2)', // Electric Blue
              '0 0 20px rgba(34, 211, 238, 0.8), inset 0 0 10px rgba(34, 211, 238, 0.4)', // Cyan
              '0 0 15px rgba(139, 92, 246, 0.6), inset 0 0 8px rgba(139, 92, 246, 0.3)', // Violet
              '0 0 20px rgba(34, 211, 238, 0.8), inset 0 0 10px rgba(34, 211, 238, 0.4)', // Cyan
              '0 0 10px rgba(59, 130, 246, 0.5), inset 0 0 5px rgba(59, 130, 246, 0.2)'  // Back to blue
            ],
            border: [
              '2px solid rgba(59, 130, 246, 0.6)',
              '2px solid rgba(34, 211, 238, 0.9)',
              '2px solid rgba(139, 92, 246, 0.7)',
              '2px solid rgba(34, 211, 238, 0.9)',
              '2px solid rgba(59, 130, 246, 0.6)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Futuristic bottom highlight pulse */}
        <motion.div 
          className="absolute bottom-0 left-1/4 right-1/4 h-[2px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 z-20"
          animate={{
            background: [
              'linear-gradient(90deg, transparent, #3b82f6, transparent)',
              'linear-gradient(90deg, transparent, #22d3ee, transparent)',
              'linear-gradient(90deg, transparent, #3b82f6, transparent)'
            ],
            width: ['50%', '80%', '50%'],
            left: ['25%', '10%', '25%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default FuturisticInput;
