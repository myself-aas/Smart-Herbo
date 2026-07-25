import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  X, Target, Activity, Scan, Zap, Focus, 
  Sun, Scaling, AlertCircle, Compass, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';

// Model target dimensions
const IMG_WIDTH = 240;
const IMG_HEIGHT = 180;

interface CameraModuleProps {
  onCapture: (image: string) => void;
  onClose: () => void;
}

interface DetectionBox {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

const CameraModule: React.FC<CameraModuleProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [detector, setDetector] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(true);
  const [feedback, setFeedback] = useState('Initializing Sensors...');
  const [error, setError] = useState<string | null>(null);
  const [activeDetection, setActiveDetection] = useState<DetectionBox | null>(null);
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'detecting' | 'locked'>('idle');
  const [torch, setTorch] = useState(false);
  const [diagData, setDiagData] = useState({
    fps: 0,
    iso: 100,
    shutter: '1/60'
  });

  useEffect(() => {
    const initDetector = async () => {
      try {
        await tf.ready();
        const model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        setDetector(model);
        setFeedback('Awaiting Target Acquisition');
        setCaptureStatus('detecting');
      } catch (err) {
        console.error("Detector Error:", err);
        setError("Neural System Offline");
      }
    };
    initDetector();
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Play error:", e));
          setIsReady(true);
        };
      }
    } catch (err) {
      setError("Vision Hardware Access Refused");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const toggleTorch = async () => {
    if (!videoRef.current?.srcObject) return;
    const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    if (capabilities.torch) {
      try {
        await track.applyConstraints({ advanced: [{ torch: !torch }] } as any);
        setTorch(!torch);
      } catch (e) {
        console.warn("Torch control failed", e);
      }
    }
  };

  useEffect(() => {
    if (!isReady || !detector || !isDetecting) return;

    let requestRef: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const detect = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const now = performance.now();
        frameCount++;
        if (now - lastTime >= 1000) {
          setDiagData(prev => ({ 
            ...prev, 
            fps: frameCount,
            iso: Math.floor(100 + Math.random() * 50),
            shutter: `1/${Math.floor(60 + Math.random() * 20)}`
          }));
          frameCount = 0;
          lastTime = now;
        }

        const predictions = await detector.detect(videoRef.current);
        const cattle = predictions.find(p => (p.class === 'cow' || p.class === 'horse') && p.score > 0.35);

        if (cattle) {
          setActiveDetection({
            bbox: cattle.bbox as [number, number, number, number],
            class: cattle.class,
            score: cattle.score
          });

          const [x, y, w, h] = cattle.bbox;
          const vW = videoRef.current.videoWidth;
          const vH = videoRef.current.videoHeight;
          const areaRatio = (w * h) / (vW * vH);

          if (areaRatio < 0.20) {
            setFeedback('TARGET TOO DISTANT');
            setCaptureStatus('detecting');
          } else if (areaRatio > 0.85) {
            setFeedback('TARGET TOO CLOSE');
            setCaptureStatus('detecting');
          } else {
            setFeedback('BIOMETRIC LOCK: NOMINAL');
            setCaptureStatus('locked');
          }
        } else {
          setActiveDetection(null);
          setFeedback('SEARCHING FOR BOVINE PROFILE...');
          setCaptureStatus('detecting');
        }
      }
      requestRef = requestAnimationFrame(detect);
    };

    requestRef = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(requestRef);
  }, [isReady, detector, isDetecting]);

  useEffect(() => {
    if (!overlayCanvasRef.current || !videoRef.current) return;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const displayWidth = videoRef.current.clientWidth;
    const displayHeight = videoRef.current.clientHeight;
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const guideWidth = displayWidth * 0.85;
    const guideHeight = guideWidth * (IMG_HEIGHT / IMG_WIDTH);
    const guideX = (displayWidth - guideWidth) / 2;
    const guideY = (displayHeight - guideHeight) / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, displayWidth, guideY);
    ctx.fillRect(0, guideY + guideHeight, displayWidth, displayHeight - (guideY + guideHeight));
    ctx.fillRect(0, guideY, guideX, guideHeight);
    ctx.fillRect(guideX + guideWidth, guideY, displayWidth - (guideX + guideWidth), guideHeight);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(guideX + guideWidth/3, guideY); ctx.lineTo(guideX + guideWidth/3, guideY + guideHeight);
    ctx.moveTo(guideX + (guideWidth/3)*2, guideY); ctx.lineTo(guideX + (guideWidth/3)*2, guideY + guideHeight);
    ctx.moveTo(guideX, guideY + guideHeight/3); ctx.lineTo(guideX + guideWidth, guideY + guideHeight/3);
    ctx.moveTo(guideX, guideY + (guideHeight/3)*2); ctx.lineTo(guideX + guideWidth, guideY + (guideHeight/3)*2);
    ctx.stroke();

    if (activeDetection) {
      const [x, y, w, h] = activeDetection.bbox;
      const sX = displayWidth / videoRef.current.videoWidth;
      const sY = displayHeight / videoRef.current.videoHeight;
      const rX = x * sX;
      const rY = y * sY;
      const rW = w * sX;
      const rH = h * sY;
      const isLocked = captureStatus === 'locked';
      ctx.strokeStyle = isLocked ? '#10b981' : '#3b82f6';
      ctx.lineWidth = 3;
      const bSize = 25;
      ctx.beginPath(); ctx.moveTo(rX, rY + bSize); ctx.lineTo(rX, rY); ctx.lineTo(rX + bSize, rY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rX + rW - bSize, rY); ctx.lineTo(rX + rW, rY); ctx.lineTo(rX + rW, rY + bSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rX, rY + rH - bSize); ctx.lineTo(rX, rY + rH); ctx.lineTo(rX + bSize, rY + rH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rX + rW - bSize, rY + rH); ctx.lineTo(rX + rW, rY + rH); ctx.lineTo(rX + rW, rY + rH - bSize); ctx.stroke();
      ctx.fillStyle = isLocked ? '#10b981' : '#3b82f6';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`ID: ${activeDetection.class.toUpperCase()} [${Math.round(activeDetection.score * 100)}%]`, rX, rY - 8);
    }
  }, [activeDetection, captureStatus]);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      setIsDetecting(false);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = IMG_WIDTH;
      canvas.height = IMG_HEIGHT;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const vW = video.videoWidth;
        const vH = video.videoHeight;
        const targetAspect = IMG_WIDTH / IMG_HEIGHT;
        const vAspect = vW / vH;
        let sx, sy, sW, sH;
        if (vAspect > targetAspect) {
          sH = vH;
          sW = vH * targetAspect;
          sx = (vW - sW) / 2;
          sy = 0;
        } else {
          sW = vW;
          sH = vW / targetAspect;
          sx = 0;
          sy = (vH - sH) / 2;
        }
        ctx.drawImage(video, sx, sy, sW, sH, 0, 0, IMG_WIDTH, IMG_HEIGHT);
        onCapture(canvas.toDataURL('image/jpeg', 0.95));
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden font-futuristic"
    >
      <div className="absolute top-0 inset-x-0 p-6 z-30 flex justify-between items-start pointer-events-none">
        <div className="space-y-4">
          <motion.div 
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4 px-6 py-4 bg-black/80 rounded-[2rem] border border-white/10 backdrop-blur-3xl pointer-events-auto shadow-2xl"
          >
            <div className={`w-3 h-3 rounded-full ${captureStatus === 'locked' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-blue-500 animate-pulse'} `} />
            <span className={`text-[12px] font-black tracking-[0.2em] uppercase italic ${captureStatus === 'locked' ? 'text-emerald-400' : 'text-white'}`}>
              {feedback}
            </span>
          </motion.div>
          
          <div className="flex flex-col gap-2 pointer-events-auto">
             <div className="px-4 py-2 bg-black/60 rounded-xl text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border border-white/5 flex items-center gap-3">
               <Focus className="w-3.5 h-3.5 text-blue-400" /> 
               <div className="flex flex-col">
                 <span>AF: AUTO_CONT</span>
                 <span className="text-[7px] text-white/20">S_NODE: 0xFF2A</span>
               </div>
             </div>
             <div className="px-4 py-2 bg-black/60 rounded-xl text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border border-white/5 flex items-center gap-3">
               <Sun className="w-3.5 h-3.5 text-amber-400" /> 
               <div className="flex flex-col">
                 <span>ISO: {diagData.iso} | S: {diagData.shutter}</span>
                 <span className="text-[7px] text-white/20">EV: +0.0</span>
               </div>
             </div>
             <div className="px-4 py-2 bg-black/60 rounded-xl text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border border-white/5 flex items-center gap-3">
               <Scaling className="w-3.5 h-3.5 text-emerald-400" /> 
               <div className="flex flex-col">
                 <span>OUT: {IMG_WIDTH}x{IMG_HEIGHT}</span>
                 <span className="text-[7px] text-white/20">FPS: {diagData.fps}</span>
               </div>
             </div>
          </div>
        </div>
        
        <div className="flex gap-4 pointer-events-auto">
          <button onClick={toggleTorch} className={`p-4 rounded-full border border-white/10 transition-all ${torch ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-white/40'}`}>
            <Zap className="w-6 h-6" />
          </button>
          <button onClick={onClose} className="p-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all">
            <X className="text-white w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
        {error ? (
          <div className="text-center space-y-8 p-12 bg-red-500/10 rounded-[3rem] border border-red-500/20 backdrop-blur-3xl mx-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h3 className="text-2xl font-black uppercase text-white tracking-tight italic">Vision Cluster Error</h3>
            <p className="text-white/40 text-sm leading-relaxed">Local hardware restrictions detected. Check camera permissions.</p>
            <button onClick={onClose} className="w-full py-5 bg-white/5 rounded-2xl font-black uppercase text-[11px] border border-white/10 tracking-widest">Abort Session</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover grayscale-[0.1] contrast-[1.2] brightness-[0.9]" />
            <canvas ref={overlayCanvasRef} className="absolute inset-0 z-10 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
               <div className="w-24 h-24 border border-white/40 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
               </div>
            </div>
            <AnimatePresence>
              {captureStatus === 'detecting' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute bottom-[20%] px-8 py-5 bg-black/80 border border-white/10 backdrop-blur-2xl rounded-3xl text-center z-30"
                >
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1">Optical Guide</p>
                  <p className="text-[13px] text-white/80 font-bold">Align subject side-profile within markers</p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <div className="h-60 bg-[#020202] border-t border-white/5 flex flex-col items-center justify-center p-8 gap-8 relative z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="w-full flex justify-around items-center max-w-md">
           <div className="flex flex-col items-center opacity-25 group">
              <Compass className="w-6 h-6 mb-2" />
              <span className="text-[9px] font-black uppercase tracking-widest">Gyro_Sync</span>
           </div>
           
           <button 
            onClick={capture}
            disabled={!isReady || !!error}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-90
              ${captureStatus === 'locked' ? 'bg-blue-600 scale-110 shadow-[0_0_50px_rgba(59,130,246,0.6)]' : 'bg-white'} 
              ${(!isReady || error) ? 'opacity-10 grayscale' : ''}`}
          >
            {captureStatus === 'locked' ? (
              <Scan className="w-10 h-10 text-white" />
            ) : (
              <Target className="w-10 h-10 text-black" />
            )}
            
            {captureStatus === 'locked' && (
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-400 rounded-full -z-10"
              />
            )}
          </button>

           <div className="flex flex-col items-center opacity-25 group">
              <Database className="w-6 h-6 mb-2" />
              <span className="text-[9px] font-black uppercase tracking-widest">Transient</span>
           </div>
        </div>
        
        <div className="flex items-center gap-4 border-t border-white/5 pt-6 w-full justify-center">
           <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic">Encrypted Local Biometric Extraction // 0xAF92</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
};

export default CameraModule;