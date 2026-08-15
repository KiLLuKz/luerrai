import React, { useState } from 'react';
import type { Store } from '../../types';
import { useFollowStore } from '../../hooks/useFollowStore';
import { Bell, BellRing, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoreCardProps {
  store: Store;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const { isFollowed, toggleFollow } = useFollowStore();
  const followed = isFollowed(store.id);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="bg-surface rounded-2xl p-5 border border-zinc-800/60 shadow-lg relative group flex justify-between items-center"
    >
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-3">
          {store.name}
          {!store.is_open && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              ปิด
            </span>
          )}
        </h3>
        <div className="flex items-center text-zinc-400 text-sm mt-1.5 gap-1.5 font-medium">
          <Clock size={16} />
          <span>{store.open_time.slice(0, 5)} - {store.close_time.slice(0, 5)}</span>
        </div>
      </div>
      
      <div 
        className="relative z-10"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleFollow(store.id)}
          className={`p-3 rounded-full transition-all ${
            followed 
              ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          {followed ? <BellRing size={22} /> : <Bell size={22} />}
        </motion.button>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-800 text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap pointer-events-none border border-zinc-700 z-20"
            >
              {followed ? 'เลิกติดตามร้านนี้' : 'ติดตามแจ้งเตือน'}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 rotate-45 border-b border-r border-zinc-700"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
