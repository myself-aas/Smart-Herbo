
import React from 'react';
import { motion } from 'framer-motion';

const ConfidenceGauge: React.FC<{ value: number }> = ({ value }) => {
  const percentage = Math.round(value * 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value * circumference);

  // Status text based on value
  const getStatus = (v: number) => {
    if (v > 0.95) return { text: "PRECISE", color: "text-emerald-400", bg: "bg-emerald-500/20" };
    if (v > 0.85) return { text: "NOMINAL", color: "text-blue-400", bg: "bg-blue-500/20" };
    return { text: "STOCHASTIC", color: "text-amber-400", bg: "bg-amber-500/20" };
  };

  const status = getStatus(value);

  return (
    <div className="relative w-40 h-40 flex items-center justify-center select-none">
      {/* Background Neural Glow */}
      <div className="absolute inset-8 bg-blue-500/5 blur-3xl rounded-full animate-pulse z-0" />
      
      {/* Outer Rotating Data Ring */}
      <motion.div 
        className="absolute inset-0 rounded-full border border-white/5 border-dashed z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] z-10 relative">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Tech Ring */}
        <circle
          cx="80" cy="80" r={radius + 12}
          className="fill-none stroke-white/5"
          strokeWidth="0.5"
        />

        {/* Secondary Inner Background Ring - Lightened to ensure no visual noise behind text */}
        <circle
          cx="80" cy="80" r={radius - 12}
          className="fill-none stroke-white/5"
          strokeWidth="1"
        />

        {/* Main Track */}
        <circle
          cx="80" cy="80" r={radius}
          className="fill-none stroke-white/10"
          strokeWidth="6"
        />

        {/* Animated Progress Ring */}
        <motion.circle
          cx="80" cy="80" r={radius}
          className="fill-none"
          stroke="url(#gaugeGradient)"
          strokeWidth="6"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Scanning Orbiter */}
        <motion.circle
          cx={80 + radius + 12}
          cy="80"
          className="fill-cyan-400"
          r="1.5"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ originX: "80px", originY: "80px" }}
        />
      </svg>

      {/* Center Readout Display - Forced to top with z-index and absolute centering */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          {/* Adjusted font size to fit inside radius 30-34 perfectly */}
          <span className="text-3xl font-black font-futuristic text-white leading-none drop-shadow-md">
            {percentage}<span className="text-xs text-white/40 ml-0.5">%</span>
          </span>
          <div className="mt-1 px-2 py-0.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
            <span className={`text-[7px] font-bold tracking-[0.15em] uppercase ${status.color}`}>
              {status.text}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Tiny bit-labels for tech vibe */}
      <div className="absolute top-2 w-full flex justify-center z-20">
        <span className="text-[6px] text-white/20 font-mono tracking-widest uppercase">L_INF_4.2</span>
      </div>
      <div className="absolute bottom-4 w-full flex justify-center z-20">
        <span className="text-[6px] text-white/20 font-mono tracking-widest uppercase">STAT_VALID</span>
      </div>

      {/* Optical Brackets - Pushed further out to prevent overlap */}
      <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-white/10 rounded-tl-sm z-10" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-white/10 rounded-tr-sm z-10" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-white/10 rounded-bl-sm z-10" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-white/10 rounded-br-sm z-10" />
    </div>
  );
};

export default ConfidenceGauge;
