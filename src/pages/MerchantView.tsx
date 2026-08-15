import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import { storeService } from '../services/storeService';
import type { Store, Menu } from '../types';
import { Plus, RotateCcw, X, Trash2, Image as ImageIcon, Check, ChevronDown } from 'lucide-react';
import { Toast, ConfirmDialog, type AlertType } from '../components/ui/Alert';
import { ImageCropper } from '../components/ui/ImageCropper';
import { motion, AnimatePresence } from 'framer-motion';

const TimeSelect = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [h, m] = value.split(':');
  return (  
    <div className="flex gap-1 sm:gap-2 items-center w-full">
      <select 
        value={h} 
        onChange={e => onChange(`${e.target.value}:${m}`)}
        className="flex-1 bg-surface border border-border text-text-primary rounded-2xl p-3 sm:p-4 outline-none focus:border-primary transition-all appearance-none text-center cursor-pointer font-medium"
      >
        {Array.from({length: 24}).map((_, i) => {
          const hr = i.toString().padStart(2, '0');
          return <option key={hr} value={hr}>{hr} น.</option>;
        })}
      </select>
      <span className="font-bold text-text-secondary">:</span>
      <select 
        value={m} 
        onChange={e => onChange(`${h}:${e.target.value}`)}
        className="flex-1 bg-surface border border-border text-text-primary rounded-2xl p-3 sm:p-4 outline-none focus:border-primary transition-all appearance-none text-center cursor-pointer font-medium"
      >
        {Array.from({length: 12}).map((_, i) => {
          const min = (i * 5).toString().padStart(2, '0');
          return <option key={min} value={min}>{min}</option>;
        })}
      </select>
    </div>
  );
};

export const MerchantView: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState<number | ''>('');
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [deletedStores, setDeletedStores] = useState<Set<number>>(new Set());
  
  // Undo Delete Store
  const [deleteUndoToast, setDeleteUndoToast] = useState<{isOpen: boolean, storeId: number, storeName: string}>({isOpen: false, storeId: 0, storeName: ''});
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modals state
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  
  // Store form
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreOpen, setNewStoreOpen] = useState('08:00');
  const [newStoreClose, setNewStoreClose] = useState('16:00');

  // Menu form
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
  const [menuName, setMenuName] = useState('');
  const [menuDesc, setMenuDesc] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuImageFile, setMenuImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI States
  const [toast, setToast] = useState<{message: string, type: AlertType, isVisible: boolean}>({ message: '', type: 'info', isVisible: false });
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, title: string, message: string, action: () => void, isDestructive: boolean}>({ isOpen: false, title: '', message: '', action: () => {}, isDestructive: false });
  const [cropper, setCropper] = useState<{isOpen: boolean, file: File | null}>({ isOpen: false, file: null });

  const showToast = (message: string, type: AlertType = 'success') => setToast({ message, type, isVisible: true });

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes on menus and stores
    const subscription = supabase
      .channel('merchant-changes')
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

  const fetchData = async () => {
    try {
      const [fetchedStores, fetchedMenus] = await Promise.all([
        storeService.getStores(),
        storeService.getMenus()
      ]);
      setStores(fetchedStores);
      setMenus(fetchedMenus);
      if (fetchedStores.length > 0 && selectedStoreId === '') {
        setSelectedStoreId(fetchedStores[0].id);
      }
    } catch (error) {
      console.error(error);
      showToast('ไม่สามารถโหลดข้อมูลได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMenu = async (e: React.MouseEvent, menuId: number, currentStatus: boolean) => {
    e.stopPropagation(); // Prevent opening edit modal
    try {
      setMenus(menus.map(m => m.id === menuId ? { ...m, is_available: !currentStatus } : m));
      await storeService.toggleMenuAvailability(menuId, !currentStatus);
    } catch (error) {
      console.error("Failed to update menu status", error);
      fetchData();
      showToast('อัปเดตสถานะไม่สำเร็จ', 'error');
    }
  };

  const handleResetAll = () => {
    if (!selectedStoreId) return;
    setConfirmDialog({
      isOpen: true,
      title: 'รีเซ็ตสถานะทั้งหมด',
      message: 'ยืนยันการตั้งให้ทุกเมนูของร้านนี้อยู่ในสถานะ "มีของ" ใช่หรือไม่?',
      isDestructive: false,
      action: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          setMenus(menus.map(m => m.store_id === selectedStoreId ? { ...m, is_available: true } : m));
          await storeService.resetAllMenus(selectedStoreId as number);
          showToast('รีเซ็ตทุกเมนูเรียบร้อยแล้ว');
        } catch (error) {
          console.error(error);
          fetchData();
          showToast('รีเซ็ตไม่สำเร็จ', 'error');
        }
      }
    });
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const newStore = await storeService.createStore(newStoreName, newStoreOpen, newStoreClose);
      setStores([...stores, newStore]);
      setSelectedStoreId(newStore.id);
      setIsStoreModalOpen(false);
      setNewStoreName('');
      showToast('สร้างร้านค้าสำเร็จ');
    } catch (error) {
      console.error(error);
      showToast('สร้างร้านค้าไม่สำเร็จ', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStore = () => {
    if (!selectedStoreId) return;
    const store = stores.find(s => s.id === selectedStoreId);
    if (!store) return;
    
    setConfirmDialog({
      isOpen: true,
      title: 'ลบร้านค้า',
      message: `คุณแน่ใจหรือไม่ที่จะลบร้าน "${store.name}"? เมนูทั้งหมดในร้านจะถูกลบไปด้วยและไม่สามารถย้อนกลับได้เมื่อครบ 5 วินาที`,
      isDestructive: true,
      action: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        
        const targetStoreId = selectedStoreId as number;
        setDeletedStores(prev => new Set(prev).add(targetStoreId));
        
        const availableStores = stores.filter(s => s.id !== targetStoreId && !deletedStores.has(s.id));
        if (availableStores.length > 0) {
          setSelectedStoreId(availableStores[0].id);
        } else {
          setSelectedStoreId('');
        }
        
        setDeleteUndoToast({ isOpen: true, storeId: targetStoreId, storeName: store.name });
        
        if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
        deleteTimerRef.current = setTimeout(async () => {
          setDeleteUndoToast({ isOpen: false, storeId: 0, storeName: '' });
          try {
            await storeService.deleteStore(targetStoreId);
          } catch (error) {
            console.error(error);
            showToast('ลบร้านค้าไม่สำเร็จ', 'error');
            setDeletedStores(prev => {
              const newSet = new Set(prev);
              newSet.delete(targetStoreId);
              return newSet;
            });
            if (!selectedStoreId) setSelectedStoreId(targetStoreId);
          }
        }, 5000);
      }
    });
  };

  const handleRestoreStore = () => {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    
    const storeIdToRestore = deleteUndoToast.storeId;
    setDeletedStores(prev => {
      const newSet = new Set(prev);
      newSet.delete(storeIdToRestore);
      return newSet;
    });
    setSelectedStoreId(storeIdToRestore);
    setDeleteUndoToast({ isOpen: false, storeId: 0, storeName: '' });
  };
  
  const handleDismissDelete = () => {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    const targetStoreId = deleteUndoToast.storeId;
    setDeleteUndoToast({ isOpen: false, storeId: 0, storeName: '' });
    
    storeService.deleteStore(targetStoreId).catch(error => {
      console.error(error);
      showToast('ลบร้านค้าไม่สำเร็จ', 'error');
      setDeletedStores(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetStoreId);
        return newSet;
      });
    });
  };

  const openCreateMenuModal = () => {
    setEditingMenuId(null);
    setMenuName('');
    setMenuDesc('');
    setMenuPrice('');
    setMenuImageFile(null);
    setIsMenuModalOpen(true);
  };

  const openEditMenuModal = (menu: Menu) => {
    setEditingMenuId(menu.id);
    setMenuName(menu.name);
    setMenuDesc(menu.description || '');
    setMenuPrice(menu.price.toString());
    setMenuImageFile(null);
    setIsMenuModalOpen(true);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStoreId) return;
    
    try {
      setIsSubmitting(true);
      let imageUrl = editingMenuId ? menus.find(m => m.id === editingMenuId)?.image_url : 'https://placehold.co/800x600/png?text=Menu';
      
      if (menuImageFile) {
        imageUrl = await storeService.uploadImage(menuImageFile);
      }

      if (editingMenuId) {
        await storeService.updateMenu(editingMenuId, {
          name: menuName,
          description: menuDesc,
          price: Number(menuPrice),
          ...(menuImageFile && { image_url: imageUrl })
        });
        showToast('อัปเดตเมนูสำเร็จ');
      } else {
        await storeService.createMenu({
          store_id: selectedStoreId as number,
          name: menuName,
          description: menuDesc,
          price: Number(menuPrice),
          image_url: imageUrl || '',
          is_available: true,
          remaining_count: 0
        });
        showToast('เพิ่มเมนูใหม่สำเร็จ');
      }
      
      await fetchData();
      setIsMenuModalOpen(false);
    } catch (error) {
      console.error(error);
      showToast('บันทึกเมนูไม่สำเร็จ (เช็ค Storage Bucket)', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteMenu = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'ลบเมนู',
      message: `คุณต้องการลบเมนู "${menuName}" ใช่หรือไม่? (ไม่สามารถกู้คืนได้)`,
      isDestructive: true,
      action: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        if (!editingMenuId) return;
        try {
          setIsSubmitting(true);
          await storeService.deleteMenu(editingMenuId);
          await fetchData();
          setIsMenuModalOpen(false);
          showToast('ลบเมนูสำเร็จ', 'success');
        } catch (error) {
          console.error(error);
          showToast('ลบเมนูไม่สำเร็จ', 'error');
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCropper({ isOpen: true, file: e.target.files[0] });
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) {
    return <div className="text-center py-20 text-text-secondary">กำลังโหลด...</div>;
  }

  const selectedStore = stores.find(s => s.id === selectedStoreId);
  const storeMenus = menus.filter(m => m.store_id === selectedStoreId);

  return (
    <div className="animate-in fade-in max-w-2xl mx-auto px-4 pb-20 pt-6">
      
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
      
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        isDestructive={confirmDialog.isDestructive}
      />
      
      {cropper.file && (
        <ImageCropper
          isOpen={cropper.isOpen}
          imageFile={cropper.file}
          onClose={() => setCropper({ isOpen: false, file: null })}
          onCropComplete={(croppedFile) => {
            setMenuImageFile(croppedFile);
            setCropper({ isOpen: false, file: null });
          }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">ระบบจัดการร้านค้า</h1>
        <button 
          onClick={() => setIsStoreModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-hover text-text-primary rounded-full text-sm font-bold hover:bg-border transition-colors shadow-sm"
        >
          <Plus size={16} /> ร้านใหม่
        </button>
      </div>

      {/* Store Selector & Delete Action */}
      <div className="bg-surface p-4 sm:p-5 rounded-3xl mb-8 border border-border/60 shadow-sm relative flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex-1 relative">
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">เลือกร้านค้าของคุณ</label>
          
          {/* Custom Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className="w-full bg-surface-hover border border-border text-text-primary rounded-2xl p-4 flex items-center justify-between font-bold text-lg sm:text-xl transition-all duration-300 ease-out hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary active:scale-[0.99] outline-none"
            >
              <span className="truncate">
                {stores.length === 0 ? "ไม่มีร้านค้าในระบบ" : (selectedStore?.name || "เลือกร้านค้า...")}
              </span>
              <motion.div animate={{ rotate: isStoreDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={20} className="text-text-secondary" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isStoreDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsStoreDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto"
                  >
                    {stores.filter(s => !deletedStores.has(s.id)).map(store => (
                      <button
                        key={store.id}
                        onClick={() => {
                          setSelectedStoreId(store.id);
                          setIsStoreDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 font-bold transition-colors ${
                          selectedStoreId === store.id 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-text-primary hover:bg-surface-hover'
                        }`}
                      >
                        {store.name}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {selectedStore && (
          <div className="flex sm:self-end">
            <button 
              onClick={handleDeleteStore}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-4 bg-red-500/10 text-red-500 rounded-2xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all duration-300 ease-out shadow-sm border border-red-500/20 hover:border-red-500"
            >
              <Trash2 size={18} /> <span className="sm:hidden lg:inline">ลบร้านค้า</span>
            </button>
          </div>
        )}
      </div>

      {selectedStore && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              รายการเมนู
              <span className="text-sm font-medium text-text-secondary bg-surface-hover px-3 py-1 rounded-full">{storeMenus.length}</span>
            </h2>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button 
                onClick={handleResetAll}
                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-full bg-surface-hover text-text-secondary hover:text-green-400 hover:bg-border transition-colors font-bold text-sm shadow-sm"
              >
                <RotateCcw size={16} /> รีเซ็ตทั้งหมด
              </button>
              <button 
                onClick={openCreateMenuModal}
                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                <Plus size={16} /> เพิ่มเมนู
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {storeMenus.map(menu => (
              <div 
                key={menu.id} 
                onClick={() => openEditMenuModal(menu)}
                className={`relative flex items-center h-32 sm:h-36 rounded-3xl overflow-hidden cursor-pointer group border transition-all duration-300 ${
                  menu.is_available ? 'border-border hover:border-zinc-600 bg-surface shadow-md' : 'border-red-900/30 bg-zinc-950/80 opacity-80 grayscale-[0.5]'
                }`}
              >
                {/* Image side */}
                <div className="w-[40%] max-w-[140px] sm:max-w-[180px] h-full relative shrink-0">
                  <img 
                    src={menu.image_url} 
                    alt={menu.name} 
                    className="w-full h-full object-cover" 
                    style={{ WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)' }}
                  />
                </div>
                
                {/* Content side */}
                <div className="flex-1 p-4 sm:p-5 pl-0 sm:pl-2 flex justify-between items-center z-10">
                  <div className="pr-4">
                    <h4 className={`font-bold text-lg sm:text-xl leading-tight mb-2 line-clamp-2 ${menu.is_available ? 'text-text-primary group-hover:text-primary transition-colors' : 'text-text-secondary line-through'}`}>
                      {menu.name}
                    </h4>
                    <p className="text-base sm:text-lg font-black text-secondary">฿{menu.price}</p>
                  </div>
                  
                  {/* Toggle Switch */}
                  <div 
                    onClick={(e) => handleToggleMenu(e, menu.id, menu.is_available)}
                    className={`shrink-0 w-16 h-9 rounded-full p-1 transition-all duration-300 shadow-inner ${menu.is_available ? 'bg-green-500 hover:bg-green-400' : 'bg-border hover:bg-zinc-600'}`}
                  >
                    <div className={`bg-white w-7 h-7 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${menu.is_available ? 'translate-x-7' : 'translate-x-0'}`}>
                      {menu.is_available && <Check size={14} className="text-green-500" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {storeMenus.length === 0 && (
              <div className="text-center text-text-secondary py-16 bg-surface rounded-3xl border-2 border-border border-dashed flex flex-col items-center">
                <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4 text-text-secondary">
                  <Plus size={32} />
                </div>
                <p className="font-medium text-lg">ยังไม่มีเมนูในร้านนี้</p>
                <p className="text-sm mt-1">กดปุ่ม "เพิ่มเมนู" เพื่อเริ่มต้นขายเลย!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      
      {/* 1. Create Store Modal */}
      <AnimatePresence>
      {isStoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsStoreModalOpen(false)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-surface border border-border p-5 sm:p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative z-10"
          >
            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary">สร้างร้านค้าใหม่</h3>
              <button onClick={() => setIsStoreModalOpen(false)} className="text-text-secondary hover:text-text-primary bg-surface-hover hover:bg-border p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateStore} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">ชื่อร้าน</label>
                <input required type="text" value={newStoreName} onChange={e => setNewStoreName(e.target.value)} className="w-full bg-surface border border-border text-text-primary rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-secondary" placeholder="เช่น ร้านป้าแมว อาหารตามสั่ง" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">เปิดกี่โมง</label>
                  <TimeSelect value={newStoreOpen} onChange={setNewStoreOpen} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">ปิดกี่โมง</label>
                  <TimeSelect value={newStoreClose} onChange={setNewStoreClose} />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 rounded-2xl bg-primary hover:bg-primary/90 text-text-primary font-bold text-lg transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20">
                {isSubmitting ? 'กำลังสร้าง...' : 'สร้างร้านค้าเลย'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* 2. Create/Edit Menu Modal */}
      <AnimatePresence>
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMenuModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-surface border border-border p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] w-full max-w-md shadow-2xl max-h-[95vh] overflow-y-auto relative z-10"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary">{editingMenuId ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}</h3>
              <button onClick={() => setIsMenuModalOpen(false)} className="text-text-secondary hover:text-text-primary bg-surface-hover hover:bg-border p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveMenu} className="space-y-3 sm:space-y-5">
              
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5 sm:mb-2">รูปภาพเมนู</label>
                <div 
                  className="w-full h-32 sm:h-48 bg-surface border-2 border-dashed border-border hover:border-primary/50 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-surface-hover/50 transition-all overflow-hidden relative group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {menuImageFile ? (
                    <img src={URL.createObjectURL(menuImageFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    editingMenuId && menus.find(m => m.id === editingMenuId)?.image_url ? (
                      <img src={menus.find(m => m.id === editingMenuId)?.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-text-secondary flex flex-col items-center gap-3">
                        <div className="p-4 bg-surface-hover rounded-full group-hover:bg-border transition-colors">
                          <ImageIcon size={32} />
                        </div>
                        <span className="text-sm font-bold">แตะเพื่ออัปโหลดรูปภาพ</span>
                      </div>
                    )
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                  {(menuImageFile || editingMenuId) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <span className="text-text-primary font-bold bg-primary/80 px-4 py-2 rounded-full text-sm">เปลี่ยนรูปภาพ</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5 sm:mb-2">ชื่อเมนู</label>
                <input required type="text" value={menuName} onChange={e => setMenuName(e.target.value)} className="w-full bg-surface border border-border text-text-primary rounded-xl sm:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-secondary text-sm sm:text-base" placeholder="เช่น ข้าวกะเพราหมูกรอบ" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5 sm:mb-2">ราคา (บาท)</label>
                <input required type="number" min="0" value={menuPrice} onChange={e => setMenuPrice(e.target.value)} className="w-full bg-surface border border-border text-text-primary rounded-xl sm:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-secondary text-sm sm:text-base" placeholder="50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5 sm:mb-2">คำอธิบายสั้นๆ (ไม่บังคับ)</label>
                <input type="text" value={menuDesc} onChange={e => setMenuDesc(e.target.value)} className="w-full bg-surface border border-border text-text-primary rounded-xl sm:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-secondary text-sm sm:text-base" placeholder="เช่น เผ็ดดุดัน" />
              </div>
              
              <div className="pt-2 flex gap-3">
                {editingMenuId && (
                  <button type="button" onClick={confirmDeleteMenu} disabled={isSubmitting} className="px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-colors shrink-0">
                    <Trash2 size={24} />
                  </button>
                )}
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base sm:text-lg transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20">
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกเมนู'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* 3. Undo Delete Toast */}
      <AnimatePresence>
        {deleteUndoToast.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-surface border border-border shadow-2xl p-4 rounded-2xl flex items-center gap-4 w-[90vw] max-w-sm"
          >
            <div className="flex-1">
              <p className="text-sm font-bold text-text-primary line-clamp-1">คุณลบร้าน "{deleteUndoToast.storeName}" สำเร็จ</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={handleRestoreStore}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors"
              >
                ย้อนกลับ
              </button>
              <button 
                onClick={handleDismissDelete}
                className="px-4 py-2 bg-surface-hover text-text-secondary rounded-xl text-xs font-bold hover:bg-border transition-colors"
              >
                ปิด
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
