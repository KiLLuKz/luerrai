import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PanicGauge } from '../components/student/PanicGauge';
import { GachaButton } from '../components/student/GachaButton';
import { StoreCard } from '../components/ui/StoreCard';
import { MenuCard } from '../components/ui/MenuCard';
import { storeService } from '../services/storeService';
import { supabase } from '../config/supabaseClient';
import type { Store, Menu } from '../types';
import { Search, Store as StoreIcon, Utensils, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { useFollowStore } from '../hooks/useFollowStore';

export const StudentView: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { followedStores } = useFollowStore();

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes on menus and stores
    const subscription = supabase
      .channel('public-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menus' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stores' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // ------------------------------
  // FUZZY SEARCH SETUP
  // ------------------------------
  const searchData = useMemo(() => [
    ...stores.map(s => ({ type: 'store', id: s.id, name: s.name, store_id: s.id })),
    ...menus.map(m => ({ type: 'menu', id: m.id, name: m.name, store_id: m.store_id }))
  ], [stores, menus]);

  const fuse = useMemo(() => new Fuse(searchData, {
    keys: ['name'],
    threshold: 0.3, // Allows minor typos (e.g., "ประเพรา" matches "กะเพรา")
  }), [searchData]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return fuse.search(searchQuery).map(res => res.item);
  }, [searchQuery, fuse]);

  const suggestions = searchResults.slice(0, 5); // Limit to 5

  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name);
    setIsDropdownOpen(false); // Close dropdown on select
  };

  // ------------------------------
  // FILTERING LOGIC
  // ------------------------------
  let matchedStoreIds = new Set<number>();
  let matchedMenuIds = new Set<number>();
  let directMatchedStoreIds = new Set<number>(); // Stores that matched by their own name

  if (searchQuery) {
    searchResults.forEach(item => {
      if (item.type === 'store') {
        matchedStoreIds.add(item.id);
        directMatchedStoreIds.add(item.id);
      }
      if (item.type === 'menu') {
        matchedStoreIds.add(item.store_id);
        matchedMenuIds.add(item.id);
      }
    });
  }

  const isStoreOpen = (store: typeof stores[0]) => {
    if (store.is_open === false) return false;
    if (!store.open_time || !store.close_time) return true;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    
    const parseTime = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    
    const openMins = parseTime(store.open_time);
    const closeMins = parseTime(store.close_time);
    
    if (openMins <= closeMins) {
      return currentMins >= openMins && currentMins <= closeMins;
    } else {
      return currentMins >= openMins || currentMins <= closeMins;
    }
  };

  const baseStores = searchQuery 
    ? stores.filter(store => matchedStoreIds.has(store.id))
    : stores;

  const storesToRender = baseStores
    .filter(store => showOnlyOpen ? isStoreOpen(store) : true)
    .sort((a, b) => {
      const aFollowed = followedStores.includes(a.id);
      const bFollowed = followedStores.includes(b.id);
      
      // 1. Followed stores always come first
      if (aFollowed && !bFollowed) return -1;
      if (!aFollowed && bFollowed) return 1;
      
      // 2. Open stores come before closed stores
      const aOpen = a.is_open !== false;
      const bOpen = b.is_open !== false;
      if (aOpen && !bOpen) return -1;
      if (!aOpen && bOpen) return 1;
      
      return 0;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-text-secondary gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse">กำลังโหลดข้อมูลจากฐานข้อมูล...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        <PanicGauge menus={menus} />
        <GachaButton menus={menus} stores={stores} />
      </div>

      {/* Search Bar with Autocomplete Dropdown */}
      <div className="sticky top-[76px] md:top-[92px] z-40 pt-2 pb-2 mb-4 px-4 -mx-4 md:px-0 md:mx-0 pointer-events-none">
        <div className="relative w-full max-w-2xl mx-auto pointer-events-auto shadow-2xl rounded-full" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="ค้นหาชื่อร้าน หรือชื่อเมนู (พิมพ์ผิดก็หาเจอ) เช่น ประเพรา..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full bg-surface border-2 border-border text-text-primary rounded-full py-4 pl-12 pr-6 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg shadow-lg placeholder:text-text-secondary font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-text-secondary hover:text-text-primary transition-colors text-sm font-bold"
            >
              ล้าง
            </button>
          )}

          {/* Suggestion Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && searchQuery && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.98 }}
                className="absolute top-full mt-2 w-full bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
              >
                {suggestions.map((item, idx) => (
                  <button
                    key={`${item.type}-${item.id}-${idx}`}
                    onClick={() => handleSuggestionClick(item.name)}
                    className="flex items-center gap-3 w-full text-left px-5 py-4 hover:bg-surface-hover transition-colors border-b border-border/50 last:border-0"
                  >
                    {item.type === 'store' ? <StoreIcon size={18} className="text-primary shrink-0" /> : <Utensils size={18} className="text-secondary shrink-0" />}
                    <span className="text-text-primary font-medium flex-1 truncate">{item.name}</span>
                    <span className="text-xs font-bold text-text-secondary shrink-0 bg-surface-hover/80 px-2 py-1 rounded-md">
                      {item.type === 'store' ? 'ร้านค้า' : 'เมนู'}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Open Now Toggle (Not sticky) */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowOnlyOpen(!showOnlyOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ease-out active:scale-95 text-sm font-bold shadow-sm ${
            showOnlyOpen 
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20' 
              : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border'
          }`}
        >
          <Clock size={16} />
          แสดงเฉพาะร้านที่เปิดอยู่
        </button>
      </div>
      
      {/* Search Results */}
      {storesToRender.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 text-text-secondary bg-surface rounded-3xl border border-border/50 shadow-sm max-w-xl mx-auto"
        >
          <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4 mx-auto text-text-secondary">
            <Search size={32} />
          </div>
          <p className="text-xl font-bold text-text-primary mb-2">ไม่พบสิ่งที่ค้นหา</p>
          <p className="text-sm">ลองเปลี่ยนคำค้นหาเป็นเมนูอื่น หรือร้านอื่นดูนะ</p>
        </motion.div>
      ) : (
        <div className="space-y-12">
          <AnimatePresence>
            {storesToRender.map(store => {
              const storeMenus = menus.filter(m => m.store_id === store.id);
              const storeMatch = directMatchedStoreIds.has(store.id);
              
              // ถ้าค้นหาตรงกับชื่อร้าน ให้โชว์ทุกเมนู, ถ้าค้นหาตรงแค่เมนู ให้กรองเฉพาะเมนูนั้นมาโชว์
              const menusToRender = (storeMatch || !searchQuery) 
                ? storeMenus 
                : storeMenus.filter(m => matchedMenuIds.has(m.id));
              
              const sortedMenusToRender = [...menusToRender].sort((a, b) => Number(b.is_available) - Number(a.is_available));
              
              if (menusToRender.length === 0 && !storeMatch) return null;

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
                      {sortedMenusToRender.map((menu, idx) => (
                        <MenuCard key={menu.id} menu={menu} store={store} delay={0.2 + (idx * 0.1)} />
                      ))}
                    </AnimatePresence>
                    
                    {menusToRender.length === 0 && (
                      <motion.p layout className="text-text-secondary italic py-4 col-span-full text-sm ml-2">
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
