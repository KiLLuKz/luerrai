import React from 'react';
import { Code, Heart } from 'lucide-react';

interface FooterProps {
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerms }) => {
  return (
    <footer className="w-full border-t border-border bg-surface-hover/30 pt-10 pb-24 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* Brand & Slogan */}
        <div className="flex flex-col items-center md:items-start max-w-sm text-center md:text-left">
          <div className="flex items-center gap-2 mb-3">
            <img src={`${import.meta.env.BASE_URL}icons_transparent.svg`} alt="LuerRai Logo" className="w-6 h-6 invert dark:invert-0 drop-shadow-sm opacity-80" />
            <h2 className="font-black text-xl tracking-tighter text-text-primary">เหลือไร?</h2>
          </div>
          <p className="text-sm text-text-secondary font-medium leading-relaxed">
            เดินไปโรงอาหารทีไร ของหมดทุกที... ปัญหานี้จะหมดไป! Canteen Tracker ที่ช่วยให้ชีวิตวัยรุ่นง่ายขึ้น
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex items-center gap-4 sm:gap-6 text-sm font-bold text-text-secondary">
            <button 
              onClick={onOpenTerms}
              className="hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              Terms of Service
            </button>
            <button 
              onClick={onOpenTerms}
              className="hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              Privacy Policy
            </button>
            <a 
              href="https://github.com/KiLLuKz/luerrai" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
            >
              <Code size={16} />
              <span>Source Code</span>
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 flex flex-col items-center gap-2">
        <div className="w-full h-px bg-border/50 mb-4" />
        <p className="text-xs sm:text-sm text-text-secondary font-medium text-center flex flex-wrap justify-center items-center gap-1.5">
          Made with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> by 
          <span className="font-bold text-text-primary">team เส้นซีวิก ซิกมาไอเท่ากับหนึ่ง ถึงอินฟินิตี้ มีอนุกรมเรขาคณิตที่มี ค่า r เท่ากับหกเจ็ด</span>
        </p>
        <p className="text-xs text-text-secondary/60 mt-1">
          © {new Date().getFullYear()} LuerRai. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
