import React, { useState } from 'react';
import type { Menu } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, X } from 'lucide-react';

interface GachaButtonProps {
  menus: Menu[];
}

export const GachaButton: React.FC<GachaButtonProps> = ({ menus }) => {
  const [result, setResult] = useState<Menu | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    if (isRolling) return;
    
    const availableMenus = menus.filter(m => m.is_available);
    if (availableMenus.length === 0) {
      alert("ไม่มีเมนูเหลือให้สุ่มเลย T_T");
      return;
    }

    setIsRolling(true);
    setResult(null);

    // Simulate rolling animation time
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableMenus.length);
      setResult(availableMenus[randomIndex]);
      setIsRolling(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full">
      <button 
        onClick={handleRoll}
        disabled={isRolling}
        className="w-full h-full min-h-[100px] rounded-2xl font-black text-xl bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] flex flex-col items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <motion.div
          animate={isRolling ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.4, repeat: isRolling ? Infinity : 0, ease: "linear" }}
          className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform"
        >
          <Dices size={32} />
        </motion.div>
        <span>{isRolling ? "กำลังสุ่ม..." : "สุ่มเมนูกาชา!"}</span>
      </button>

      <AnimatePresence>
        {result && !isRolling && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <div className="bg-surface border-2 border-primary/50 shadow-[0_0_30px_rgba(236,72,153,0.3)] p-6 rounded-3xl relative w-full max-w-sm">
              <button 
                onClick={() => setResult(null)} 
                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="text-center mb-4">
                <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-3">
                  ✨ เมนูเอาชีวิตรอดวันนี้ ✨
                </div>
                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden shadow-2xl mb-4 border-4 border-surface">
                  <img src={result.image_url} alt={result.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-2xl font-black text-white leading-tight mb-2">{result.name}</h4>
                <p className="text-sm text-zinc-400 italic">"{result.description}"</p>
                <div className="mt-4 text-secondary font-black text-xl">฿{result.price}</div>
              </div>
              <button 
                onClick={() => setResult(null)}
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors mt-2"
              >
                โอเค จัดไป!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
