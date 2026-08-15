import React, { useState, useEffect } from 'react';
import { PanicGauge } from '../components/student/PanicGauge';
import { GachaButton } from '../components/student/GachaButton';
import { StoreCard } from '../components/ui/StoreCard';
import { MenuCard } from '../components/ui/MenuCard';
import { storeService } from '../services/storeService';
import { supabase } from '../config/supabaseClient';
import type { Store, Menu } from '../types';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const StudentView: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes on menus
    const subscription = supabase
      .channel('public:menus')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menus' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [fetchedStores, fetchedMenus] = await Promise.all([
        storeService.getStores(),
        storeService.getMenus()
      ]);
      setStores(fetchedStores);
      setMenus(fetchedMenus);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-400 gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse">กำลังโหลดข้อมูลจากฐานข้อมูล...</p>
      </div>
    );
  }

  const normalizedQuery = searchQuery.toLowerCase().trim();

  // กรองร้านค้า: ถ้าร้านชื่อตรง หรือมีเมนูชื่อตรง ให้โชว์ร้านนั้น
  const storesToRender = stores.filter(store => {
    if (!normalizedQuery) return true;
    const storeMatch = store.name.toLowerCase().includes(normalizedQuery);
    const storeMenus = menus.filter(m => m.store_id === store.id);
    const menuMatch = storeMenus.some(m => m.name.toLowerCase().includes(normalizedQuery));
    return storeMatch || menuMatch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        <PanicGauge menus={menus} />
        <GachaButton menus={menus} />
      </div>

      {/* Search Bar */}
      <div className="relative mb-10 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="ค้นหาชื่อร้าน หรือชื่อเมนู เช่น ข้าวมันไก่..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border-2 border-zinc-800 text-white rounded-full py-4 pl-12 pr-6 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg shadow-lg placeholder:text-zinc-600 font-medium"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-zinc-500 hover:text-white transition-colors text-sm font-bold"
          >
            ล้าง
          </button>
        )}
      </div>
      
      {storesToRender.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 text-zinc-500 bg-surface rounded-3xl border-2 border-zinc-800 border-dashed max-w-xl mx-auto"
        >
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 mx-auto text-zinc-600">
            <Search size={32} />
          </div>
          <p className="text-xl font-bold text-white mb-2">ไม่พบสิ่งที่ค้นหา</p>
          <p className="text-sm">ลองเปลี่ยนคำค้นหาเป็นเมนูอื่น หรือร้านอื่นดูนะ</p>
        </motion.div>
      ) : (
        <div className="space-y-12">
          <AnimatePresence mode="popLayout">
            {storesToRender.map(store => {
              const storeMenus = menus.filter(m => m.store_id === store.id);
              const storeMatch = store.name.toLowerCase().includes(normalizedQuery);
              
              // ถ้าค้นหาตรงกับชื่อร้าน ให้โชว์ทุกเมนู, ถ้าค้นหาตรงแค่เมนู ให้กรองเฉพาะเมนูนั้นมาโชว์
              const menusToRender = (storeMatch && normalizedQuery) 
                ? storeMenus 
                : storeMenus.filter(m => !normalizedQuery || m.name.toLowerCase().includes(normalizedQuery));
              
              if (menusToRender.length === 0 && !storeMatch) return null; // ไม่น่าจะเกิดขึ้นจาก logic ด้านบน แต่วางกันเหนียว

              return (
                <motion.section 
                  key={store.id} 
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="space-y-5"
                >
                  <StoreCard store={store} />
                  
                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    <AnimatePresence>
                      {menusToRender.map(menu => (
                        <MenuCard key={menu.id} menu={menu} />
                      ))}
                    </AnimatePresence>
                    
                    {menusToRender.length === 0 && (
                      <motion.p layout className="text-zinc-500 italic py-4 col-span-full text-sm ml-2">
                        ร้านนี้ยังไม่มีเมนู
                      </motion.p>
                    )}
                  </motion.div>
                </motion.section>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
