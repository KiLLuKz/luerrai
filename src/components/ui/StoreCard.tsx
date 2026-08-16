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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`bg-surface rounded-2xl p-5 border shadow-sm transition-all duration-300 relative group flex justify-between items-center ${
        !store.is_open ? 'border-border/50' : 'border-border hover:border-border/80 hover:shadow-md'
      }`}
    >
      {!store.is_open && (
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-[5] rounded-2xl pointer-events-none" />
      )}

      
      <div className="relative z-10 flex-1 pr-4">
        <h3 className="text-xl md:text-2xl font-extrabold text-text-primary flex flex-wrap items-center gap-2 md:gap-3">
          <span className="break-words">{store.name}</span>
          {!store.is_open && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/30">
              ปิด
            </span>
          )}
        </h3>
        <div className="flex items-center text-text-secondary text-sm mt-1.5 gap-1.5 font-medium">
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
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleFollow(store.id)}
          className={`p-3 rounded-full transition-all duration-300 ease-out ${
            followed 
              ? 'bg-primary/10 text-primary border border-primary/20' 
              : 'bg-transparent border border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary dark:bg-zinc-800 dark:border-transparent dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white'
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
              className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-text-primary text-background dark:bg-zinc-800 dark:text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap pointer-events-none border border-transparent dark:border-zinc-700 z-20"
            >
              {followed ? 'เลิกติดตามร้านนี้' : 'ติดตามแจ้งเตือน'}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-text-primary dark:bg-zinc-800 rotate-45 border-b border-r border-transparent dark:border-zinc-700"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
