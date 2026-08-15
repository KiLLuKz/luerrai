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

  // Responsive sizes for Gacha wheel
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  const itemWidth = isDesktop ? 192 : 128; // md:w-48 vs w-32
  const gap = isDesktop ? 24 : 16; // md:gap-6 vs gap-4
  const itemOffset = itemWidth / 2;
  const totalItemWidth = itemWidth + gap;

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

    // Play Spin SFX
    const spinAudio = new Audio('/spin.mp3');
    spinAudio.volume = 0.5;
    // Slow down the audio slightly so it stretches to match the visual end
    spinAudio.playbackRate = 0.85; 
    spinAudio.loop = false; // Prevent it from looping and sounding awkward
    spinAudio.play().catch(e => console.log('SFX play failed (Spin):', e));

    // Simulate animation time (duration = 4s, spin stops visually at 3.5s)
    setTimeout(() => {
      spinAudio.pause();
      
      const winAudio = new Audio('/win.mp3');
      winAudio.volume = 0.7;
      winAudio.play().catch(e => console.log('SFX play failed (Win):', e));
      
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
        className="w-full h-full min-h-[100px] rounded-[2rem] font-black text-xl bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-xl active:scale-[0.98] flex flex-row items-center justify-center gap-4 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 group"
      >
        <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out">
          <Dices size={28} strokeWidth={2.5} />
        </div>
        <span className="tracking-tight">{isRolling ? "กำลังหมุน..." : "สุ่มเมนูกาชา"}</span>
      </button>

      <AnimatePresence>
        {isRolling && spinTrack.length > 0 && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
            <div className="w-full max-w-5xl overflow-hidden relative border-y-2 border-primary/30 py-10 md:py-20 bg-surface/50">
              {/* Center Pointer (Winner Indicator) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-primary z-10 shadow-lg rounded-full"></div>
              
              {/* Gradient fade on edges */}
              <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

              {/* Wheel Track */}
              <motion.div 
                className="flex items-center gap-4 md:gap-6 py-4 md:py-8"
                initial={{ x: "50%" }}
                animate={{ x: `calc(50% - ${winnerTrackIndex * totalItemWidth}px - ${itemOffset}px)` }}
                transition={{ duration: 3.5, ease: [0.15, 0.9, 0.2, 1] }}
              >
                {spinTrack.map((menu, idx) => (
                  <div 
                    key={idx} 
                    className="w-32 h-44 md:w-48 md:h-64 shrink-0 bg-surface rounded-2xl md:rounded-3xl border border-border overflow-hidden flex flex-col items-center justify-center p-3 md:p-5 shadow-lg"
                  >
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 md:mb-5 border-2 border-surface-hover shadow-sm">
                      <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-center text-text-primary line-clamp-2">{menu.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-text-primary font-black text-2xl md:text-3xl animate-pulse tracking-tight">
              กำลังสุ่มเมนู...
            </div>
          </div>
        )}

        {result && !isRolling && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <div className="bg-surface border border-border shadow-2xl p-6 rounded-[2rem] relative w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setResult(null)} 
                className="absolute top-4 right-4 text-text-secondary hover:text-text-primary bg-surface-hover hover:bg-border p-2 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6 pt-2">
                <div className="text-primary font-bold text-xs mb-4 uppercase tracking-[0.2em]">
                  Result
                </div>
                
                <div className="w-40 h-40 mx-auto rounded-3xl overflow-hidden shadow-lg mb-5 border border-border bg-surface-hover">
                  <img src={result.image_url} alt={result.name} className="w-full h-full object-cover" />
                </div>
                
                <h4 className="text-2xl sm:text-3xl font-black text-text-primary leading-none tracking-tighter mb-3">{result.name}</h4>
                
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
                className="w-full py-3.5 mt-6 rounded-[1.25rem] bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg transition-all duration-300 ease-out active:scale-95 shadow-md shadow-emerald-500/20"
              >
                จัดไป
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
