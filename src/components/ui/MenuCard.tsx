import React from 'react';
import type { Menu } from '../../types';
import { motion } from 'framer-motion';

interface MenuCardProps {
  menu: Menu;
}

export const MenuCard: React.FC<MenuCardProps> = ({ menu }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`bg-surface rounded-2xl overflow-hidden border transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ${menu.is_available ? 'border-zinc-800/80 hover:border-primary/50' : 'border-red-900/30 opacity-75 grayscale-[0.5]'} flex flex-col h-full`}
    >
      <div className="w-full h-40 relative shrink-0 overflow-hidden">
        <img 
          src={menu.image_url} 
          alt={menu.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        {!menu.is_available && (
          <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-500 text-white text-sm font-black px-3 py-1.5 rounded-lg transform -rotate-12 shadow-lg tracking-wider">
              SOLD OUT
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow justify-between relative z-10 bg-surface">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-white text-base leading-tight text-xl">{menu.name}</h4>
          </div>
          <p className="text-l text-zinc-400 italic mt-2 line-clamp-2">"{menu.description}"</p>
        </div>
        
        <div className="mt-4 flex justify-between items-end">
          {menu.is_available ? (
            <span className="text-xs font-bold px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              มีของ
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
              หมดแล้ว
            </span>
          )}
          <span className="text-xl font-black text-secondary">
            ฿{menu.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
