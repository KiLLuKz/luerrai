import React from 'react';
import type { Menu } from '../../types';
import { motion } from 'framer-motion';

interface PanicGaugeProps {
  menus: Menu[];
}

export const PanicGauge: React.FC<PanicGaugeProps> = ({ menus }) => {
  const totalMenus = menus.length;
  const soldOutMenus = menus.filter(m => !m.is_available).length;
  const panicPercentage = totalMenus === 0 ? 0 : Math.round((soldOutMenus / totalMenus) * 100);

  let statusText = "ปกติดี ของกินเพียบ";
  let colorClass = "bg-green-500";

  if (panicPercentage > 80) {
    statusText = "วิกฤต! รีบวิ่งดิเอ๋ย!";
    colorClass = "bg-red-600";
  } else if (panicPercentage > 50) {
    statusText = "เริ่มตึงมือ ของอร่อยใกล้หมด";
    colorClass = "bg-orange-500";
  } else if (panicPercentage > 20) {
    statusText = "ต้องรีบหน่อยนะ";
    colorClass = "bg-yellow-400";
  }

  return (
    <div className="w-full h-full bg-surface p-6 rounded-2xl shadow-lg border border-border/60 flex flex-col justify-center">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">Panic Gauge</h3>
          <p className="text-m font-medium text-text-secondary">{statusText}</p>
        </div>
        <span className={`text-3xl font-black ${panicPercentage > 80 ? 'text-red-500' : 'text-text-primary'}`}>
          {panicPercentage}%
        </span>
      </div>
      <div className="h-4 w-full bg-surface rounded-full overflow-hidden relative shadow-inner">
        <motion.div 
          className={`h-full ${colorClass} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${panicPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
        </motion.div>
      </div>
    </div>
  );
};
