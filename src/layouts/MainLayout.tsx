import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChefHat, Store } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isMerchant = location.pathname.includes('/merchant');

  return (
    <div className="min-h-screen bg-background text-text-primary pb-20 overflow-x-hidden relative font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
              <ChefHat size={22} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">เหลือไร?</h1>
              <p className="text-xs text-primary font-semibold tracking-wide uppercase">Canteen Tracker</p>
            </div>
          </div>
          
          <Link 
            to={isMerchant ? '/' : '/merchant'}
            className="text-sm font-medium px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-2 transition-all border border-zinc-700 hover:border-primary/50"
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 w-full">
        <Outlet />
      </main>
    </div>
  );
};
