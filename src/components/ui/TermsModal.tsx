import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-surface border border-border shadow-2xl rounded-3xl overflow-hidden relative w-full max-w-2xl max-h-[85vh] z-10 flex flex-col"
          >
            <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center bg-surface-hover/50">
              <h2 className="text-xl sm:text-2xl font-black text-text-primary">Terms of Service & Privacy Policy</h2>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-colors active:scale-90"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 prose prose-sm sm:prose-base dark:prose-invert max-w-none text-text-secondary">
              <h3 className="text-lg font-bold text-text-primary mb-2">1. การยอมรับเงื่อนไข (Acceptance of Terms)</h3>
              <p className="mb-4">
                การที่คุณเข้าใช้งานเว็บไซต์ "เหลือไร?" ถือว่าคุณได้ยอมรับเงื่อนไขการให้บริการเหล่านี้แล้ว หากคุณไม่เห็นด้วยกับเงื่อนไขใดๆ กรุณางดการใช้งานเว็บไซต์นี้
              </p>
              
              <h3 className="text-lg font-bold text-text-primary mb-2">2. บริการของเรา (Our Service)</h3>
              <p className="mb-4">
                "เหลือไร?" เป็นเพียงแพลตฟอร์มสื่อกลางในการแจ้งสถานะเมนูอาหารในโรงอาหาร ข้อมูลทั้งหมดเกิดจากการอัปเดตโดยผู้ใช้ (Crowdsourced) หรือเจ้าของร้าน ทางเราไม่ขอรับผิดชอบต่อความผิดพลาด ความล่าช้า หรือความไม่ตรงกันของข้อมูลสถานะอาหารกับความเป็นจริง
              </p>

              <h3 className="text-lg font-bold text-text-primary mb-2">3. นโยบายความเป็นส่วนตัว (Privacy Policy)</h3>
              <p className="mb-4">
                - <strong>ข้อมูลที่จัดเก็บ:</strong> เรามีการใช้งาน LocalStorage เพื่อบันทึกสถานะการตั้งค่าของคุณ (เช่น การเปิด Dark Mode, รายชื่อร้านที่กดติดตาม, และการยอมรับ Cookie) <br/>
                - <strong>Cookie:</strong> เว็บไซต์ของเรามีการใช้ Cookie หรือเทคโนโลยีที่คล้ายคลึงกัน (Local Storage) เพื่อให้ระบบจดจำสถานะการใช้งานของคุณ และเพื่อประสบการณ์การใช้งานที่ดีขึ้น เราไม่ได้นำข้อมูลนี้ไปใช้เพื่อการโฆษณาหรือส่งต่อให้บุคคลที่สาม
              </p>
              
              <h3 className="text-lg font-bold text-text-primary mb-2">4. ข้อมูลการพูดคุย (Live Chat)</h3>
              <p className="mb-4">
                ข้อความที่ส่งเข้ามาในระบบ Live Commute Chat จะเป็นข้อความสาธารณะ ผู้ใช้งานควรใช้ถ้อยคำที่สุภาพและเหมาะสม ทางผู้จัดทำขอสงวนสิทธิ์ในการระงับหรือลบข้อความที่ไม่เหมาะสมโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
              </p>

              <h3 className="text-lg font-bold text-text-primary mb-2">5. ข้อจำกัดความรับผิดชอบ (Disclaimer)</h3>
              <p className="mb-4">
                โปรเจกต์นี้จัดทำขึ้นเพื่อการแข่งขัน Hackathon เท่านั้น
              </p>
              
              <p className="mt-8 text-sm italic border-t border-border/50 pt-4">
                อัปเดตล่าสุด: สิงหาคม 2026
              </p>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-border bg-surface-hover/30 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 active:scale-95"
              >
                ฉันเข้าใจและยอมรับ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
