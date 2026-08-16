import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('luerrai_cookie_consent');
    if (!consent) {
      // Small delay so it slides in after page load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('luerrai_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto sm:max-w-sm z-[90] bg-surface/90 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
        >
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-full shrink-0">
              <Cookie size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary mb-1">เราใช้คุกกี้ 🍪</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                เว็บ "เหลือไร?" ใช้ Local Storage และคุกกี้เพื่อจำค่าการตั้งค่าของคุณ (เช่น ร้านโปรด, Dark Mode) ให้ใช้งานได้ลื่นไหลขึ้น ไม่มีแอบเอาไปขายโฆษณาแน่นอน!
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button 
              onClick={acceptCookies}
              className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/90 transition-colors active:scale-95 shadow-md shadow-primary/20 w-full sm:w-auto"
            >
              เข้าใจแล้ว ปิดเลย
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
