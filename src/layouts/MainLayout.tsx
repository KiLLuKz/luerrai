import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChefHat, Store, Moon, Sun } from 'lucide-react';
import { LiveChat } from '../components/ui/LiveChat';
import { useTheme } from '../context/ThemeContext';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isMerchant = location.pathname.includes('/merchant');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-text-primary pb-20 overflow-x-clip relative font-sans transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl text-text-primary shadow-lg shadow-primary/20">
              <ChefHat size={22} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-text-primary">เหลือไร?</h1>
              <p className="text-xs text-primary font-semibold tracking-wide uppercase">Canteen Tracker</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-surface-hover hover:bg-border/50 text-text-secondary hover:text-text-primary transition-colors border border-border"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link 
              to={isMerchant ? '/' : '/merchant'}
            className="text-sm font-medium px-4 py-2 rounded-full bg-surface-hover hover:bg-border text-text-primary flex items-center gap-2 transition-all border border-border hover:border-primary/50"
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
    </div>
  );
};
