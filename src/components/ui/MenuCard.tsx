import React, { useState } from 'react';
import type { Menu, Store } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Store as StoreIcon, Clock } from 'lucide-react';

interface MenuCardProps {
  menu: Menu;
  store?: Store;
  delay?: number;
}

const SOLD_OUT_MEMES = [
  "แห้วแดก (M.6 Edition)",
  "หมดแล้วจ้า ม.6 ร้องไห้",
  "ช้าไปนะวัยรุ่น",
  "ไว้เจอกันชาติหน้า",
  "คิวสุดท้ายเพิ่งเหมาไป!"
];

const getSoldOutText = (id: number) => {
  return SOLD_OUT_MEMES[id % SOLD_OUT_MEMES.length];
};

export const MenuCard: React.FC<MenuCardProps> = ({ menu, store, delay = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div 
        layout="position"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ 
          opacity: 0, 
          scale: 0.8,
          transition: { duration: 0.15, ease: "easeIn", delay: 0 } 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          opacity: { delay },
          scale: { delay },
          y: { delay },
          layout: { delay: 0 }
        }}
        onClick={() => {
          if (menu.is_available && (!store || store.is_open !== false)) setIsOpen(true);
        }}
        className={`bg-surface border-2 border-border rounded-2xl sm:rounded-3xl overflow-hidden hover:border-primary/50 transition-all group shadow-lg flex flex-row sm:flex-col relative ${(!menu.is_available || (store && store.is_open === false)) ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {(!menu.is_available || (store && store.is_open === false)) && (
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 pointer-events-none" />
        )}
        <div className="relative w-28 sm:w-auto shrink-0 aspect-square sm:aspect-[4/3] overflow-hidden bg-surface-hover">
          <img 
            src={menu.image_url} 
            alt={menu.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {!menu.is_available && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <span className="bg-surface/90 backdrop-blur-md text-red-500 px-3 py-1 sm:px-5 sm:py-2 rounded-full text-xs sm:text-base font-bold rotate-[-6deg] shadow-xl border border-red-500/20 tracking-wide uppercase">{getSoldOutText(menu.id)}</span>
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-5 flex flex-col flex-1 relative justify-center sm:justify-start">
          <div>
            <h3 className="text-base sm:text-xl font-black text-text-primary mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors leading-tight tracking-tight">
              {menu.name}
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-4 italic flex-1">
              "{menu.description}"
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg sm:text-2xl font-black text-primary">฿{menu.price}</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-surface border border-border shadow-2xl rounded-[2rem] overflow-hidden relative w-full max-w-sm sm:max-w-4xl max-h-[90vh] z-10 flex flex-col sm:flex-row"
            >
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-3 right-3 text-white bg-black/50 hover:bg-black p-2 rounded-full transition-colors z-20 backdrop-blur-sm"
              >
                <X size={20} />
              </button>
              
              <div className="w-full sm:w-1/2 aspect-square sm:aspect-[4/3] bg-surface-hover relative shrink-0">
                <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" />
                {!menu.is_available && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-surface/90 backdrop-blur-md text-red-500 px-5 py-2 rounded-full text-base sm:text-2xl font-bold rotate-[-6deg] shadow-2xl border border-red-500/20 tracking-wide uppercase">{getSoldOutText(menu.id)}</span>
                  </div>
                )}
              </div>
              
              <div className="p-4 sm:p-10 flex flex-col items-center sm:items-start text-center sm:text-left bg-surface sm:w-1/2 sm:justify-center overflow-y-auto">
                {store && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-text-secondary font-bold text-sm sm:text-base mb-3 bg-surface-hover px-4 py-1.5 rounded-full w-fit mx-auto sm:mx-0">
                    <StoreIcon size={16} className="text-primary" />
                    <span>{store.name}</span>
                  </div>
                )}
                
                <h4 className="text-2xl sm:text-4xl font-black text-text-primary leading-none tracking-tighter mb-2 sm:mb-3">{menu.name}</h4>
                
                {store && (
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-text-secondary text-xs sm:text-sm mb-2 sm:mb-4">
                    <Clock size={14} />
                    <span>เปิด {store.open_time.slice(0, 5)} - {store.close_time.slice(0, 5)}</span>
                  </div>
                )}
                
                <div className="w-full h-px bg-border my-3 sm:my-6"></div>
                
                <p className="text-sm sm:text-lg text-text-secondary italic mb-4 sm:mb-8">"{menu.description}"</p>
                
                <div className="mt-auto text-primary font-black text-3xl sm:text-5xl">฿{menu.price}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
