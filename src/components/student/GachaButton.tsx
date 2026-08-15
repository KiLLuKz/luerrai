import React, { useState } from 'react';
import type { Menu, Store } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, X, Store as StoreIcon } from 'lucide-react';

interface GachaButtonProps {
  menus: Menu[];
  stores?: Store[];
}

export const GachaButton: React.FC<GachaButtonProps> = ({ menus, stores = [] }) => {
  const [result, setResult] = useState<Menu | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [spinTrack, setSpinTrack] = useState<Menu[]>([]);
  const [winnerTrackIndex, setWinnerTrackIndex] = useState(0);

  const handleRoll = () => {
    if (isRolling) return;
    
    const availableMenus = menus.filter(m => m.is_available);
    if (availableMenus.length === 0) {
      alert("ไม่มีเมนูเหลือให้สุ่มเลย T_T");
      return;
    }

    // 1. Pick a winner
    const randomIndex = Math.floor(Math.random() * availableMenus.length);
    const winner = availableMenus[randomIndex];
    
    // 2. Generate a long track for the spin wheel (approx 30 items)
    const trackLength = 30;
    const stopIndex = 25; // stop at 25th item
    
    const track = [];
    for (let i = 0; i < trackLength; i++) {
      if (i === stopIndex) {
        track.push(winner);
      } else {
        const rnd = Math.floor(Math.random() * availableMenus.length);
        track.push(availableMenus[rnd]);
      }
    }
    
    setSpinTrack(track);
    setWinnerTrackIndex(stopIndex);
    setIsRolling(true);
    setResult(null);

    // Simulate animation time (duration = 4s)
    setTimeout(() => {
      setResult(winner);
      setIsRolling(false);
    }, 4000);
  };

  const getStoreName = (storeId: number) => {
    return stores.find(s => s.id === storeId)?.name || 'ไม่ทราบชื่อร้าน';
  };

  const getSuggestions = (resultMenu: Menu) => {
    return menus
      .filter(m => m.store_id === resultMenu.store_id && m.id !== resultMenu.id && m.is_available)
      .slice(0, 3); // Max 3 suggestions
  };

  return (
    <div className="w-full h-full">
      <button 
        onClick={handleRoll}
        disabled={isRolling}
        className="w-full h-full min-h-[100px] rounded-2xl font-black text-xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] flex flex-row items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="bg-white/20 p-2.5 rounded-full group-hover:scale-110 transition-transform">
          <Dices size={24} />
        </div>
        <span>{isRolling ? "กำลังหมุน..." : "สุ่มเมนูกาชา!"}</span>
      </button>

      <AnimatePresence>
        {isRolling && spinTrack.length > 0 && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
            <div className="w-full max-w-3xl overflow-hidden relative border-y-2 border-primary/30 py-8 bg-surface/50">
              {/* Center Pointer (Winner Indicator) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-primary z-10 shadow-[0_0_15px_rgba(236,72,153,0.8)] rounded-full"></div>
              
              {/* Gradient fade on edges */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

              {/* Wheel Track */}
              <motion.div 
                className="flex items-center gap-4 py-4"
                initial={{ x: "50%" }}
                // Item width is w-32 (128px) + gap-4 (16px) = 144px. 
                // We offset by half of 128 (64px) so the item aligns exactly in the center.
                animate={{ x: `calc(50% - ${winnerTrackIndex * 144}px - 64px)` }}
                transition={{ duration: 3.5, ease: [0.15, 0.9, 0.2, 1] }}
              >
                {spinTrack.map((menu, idx) => (
                  <div 
                    key={idx} 
                    className="w-32 h-44 shrink-0 bg-surface rounded-2xl border border-border overflow-hidden flex flex-col items-center justify-center p-3 shadow-lg"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-surface-hover shadow-sm">
                      <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-center text-text-primary line-clamp-2">{menu.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-text-primary font-black text-2xl animate-pulse">
              กำลังสุ่มเมนู...
            </div>
          </div>
        )}

        {result && !isRolling && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <div className="bg-surface border-2 border-primary/50 shadow-[0_0_30px_rgba(236,72,153,0.3)] p-6 rounded-[2rem] relative w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setResult(null)} 
                className="absolute top-4 right-4 text-text-secondary hover:text-text-primary bg-surface-hover hover:bg-border p-2 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6 pt-2">
                <div className="text-primary font-black text-lg mb-4 uppercase tracking-widest">
                  Result
                </div>
                
                <div className="w-40 h-40 mx-auto rounded-3xl overflow-hidden shadow-2xl mb-5 border-4 border-surface bg-surface-hover">
                  <img src={result.image_url} alt={result.name} className="w-full h-full object-cover" />
                </div>
                
                <h4 className="text-2xl sm:text-3xl font-black text-text-primary leading-tight mb-2">{result.name}</h4>
                
                <div className="flex items-center justify-center gap-2 text-text-secondary mb-3 font-medium bg-surface-hover mx-auto w-fit px-4 py-1.5 rounded-full">
                  <StoreIcon size={16} className="text-primary" />
                  <span className="text-sm">ร้าน {getStoreName(result.store_id)}</span>
                </div>

                <div className="mt-2 text-secondary font-black text-2xl">฿{result.price}</div>
              </div>

              {/* Mini Suggestions */}
              {getSuggestions(result).length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h5 className="text-sm font-bold text-text-secondary mb-3 text-left">เมนูอื่นในร้านเดียวกัน:</h5>
                  <div className="space-y-2">
                    {getSuggestions(result).map(sug => (
                      <div key={sug.id} className="flex items-center gap-3 p-2 rounded-xl bg-surface-hover/50 hover:bg-surface-hover transition-colors border border-transparent hover:border-border cursor-pointer">
                        <img src={sug.image_url} alt={sug.name} className="w-12 h-12 rounded-lg object-cover bg-surface shrink-0 border border-border" />
                        <div className="flex-1 text-left overflow-hidden">
                          <div className="text-sm font-bold text-text-primary line-clamp-1">{sug.name}</div>
                          <div className="text-xs font-bold text-secondary">฿{sug.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => setResult(null)}
                className="w-full py-3.5 mt-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-all hover:shadow-lg hover:shadow-primary/20"
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
