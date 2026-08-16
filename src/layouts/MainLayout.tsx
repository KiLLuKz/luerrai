import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Store, Moon, Sun } from 'lucide-react';
import { LiveChat } from '../components/ui/LiveChat';
import { Footer } from '../components/ui/Footer';
import { CookieBanner } from '../components/ui/CookieBanner';
import { TermsModal } from '../components/ui/TermsModal';
import { useTheme } from '../context/ThemeContext';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isMerchant = location.pathname.includes('/merchant');
  const { theme, toggleTheme } = useTheme();
  const [isTermsOpen, setIsTermsOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-text-primary pb-20 overflow-x-clip relative font-sans transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center">
              <img src={`${import.meta.env.BASE_URL}icons_transparent.svg`} alt="LuerRai Logo" className="w-8 h-8 invert dark:invert-0 drop-shadow-sm" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-black text-2xl tracking-tighter text-text-primary leading-none">เหลือไร?</h1>
              <p className="text-[10px] text-text-secondary font-bold tracking-[0.2em] uppercase mt-1 leading-none">Canteen Tracker</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-all duration-300 ease-out active:scale-95 border border-transparent hover:border-border"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </button>
            <Link 
              to={isMerchant ? '/' : '/merchant'}
            className="text-sm font-bold px-4 py-2 rounded-full bg-surface-hover text-text-primary flex items-center gap-2 transition-all duration-300 ease-out active:scale-95 border border-border hover:border-primary/50"
          >
            {isMerchant ? 'หน้าหลักนักเรียน' : (
              <>
                <Store size={16} />
                <span className="hidden sm:inline">หน้าจัดการร้านค้า</span>
                <span className="sm:hidden">ร้านค้า</span>
              </>
            )}
          </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 w-full">
        <Outlet />
      </main>

      {/* Global Live Chat */}
      <LiveChat />

      {/* Footer */}
      <Footer onOpenTerms={() => setIsTermsOpen(true)} />

      {/* Cookie Banner */}
      <CookieBanner />

      {/* Terms Modal */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
};
