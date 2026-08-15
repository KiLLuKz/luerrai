# 🍛 เหลือไร (LuerRai)

> "เดินไปโรงอาหารทีไร ของหมดทุกที... ปัญหานี้จะหมดไป!"

**เหลือไร (LuerRai)** คือ Web Application สำหรับนักศึกษามหาวิทยาลัย และพ่อค้าแม่ค้าในโรงอาหาร ที่ช่วยให้นักศึกษาสามารถเช็คได้แบบ **Real-time** ว่าตอนนี้ร้านไหนยังเปิดอยู่ และเมนูโปรดของพวกเขา "เหลือ" หรือ "หมด" ไปแล้ว จะได้ไม่ต้องเดินฝ่าแดดร้อนๆ ไปเก้ออีกต่อไป!

---

## ✨ Features

### 👨‍🎓 ฝั่งนักศึกษา (Student View)
- **👀 Real-time Menu Tracking:** ดูสถานะเมนูอาหาร (มีของ / หมดแล้ว) ได้ทันทีแบบไม่ต้องรีเฟรชหน้าจอ (Powered by Supabase Realtime)
- **🔍 Fuzzy Search & Autocomplete:** ค้นหาร้านหรือเมนูได้รวดเร็ว พิมพ์ผิดนิดหน่อยระบบก็ยังหาเจอ!
- **⏰ Open Now Filter:** ปุ่มกดเพื่อกรองดูเฉพาะ "ร้านที่กำลังเปิดอยู่" ณ เวลานั้น
- **❤️ Favorite Store:** กดติดตามร้านโปรดไว้ดูสถานะได้ง่ายขึ้น
- **😨 Panic Gauge:** หลอดวัดความตึงเครียด (บอกว่าอาหารทั้งโรงอาหารเหลือน้อยแค่ไหนแล้ว รีบไปกินด่วน!)
- **🎲 Gacha Button:** คิดไม่ออกว่าจะกินอะไร? กดปุ่มสุ่มอาหารได้เลย!

### 👩‍🍳 ฝั่งแม่ค้า (Merchant View)
- **🏪 Store Management:** สร้างร้านค้า ตั้งเวลาเปิด-ปิด (ระบบ 24H)
- **📸 Smart Image Cropper:** อัปโหลดและครอบตัดรูปภาพเมนูให้สวยงามพอดีกรอบ (อัตราส่วน 4:3)
- **⚡ 1-Click Sold Out:** เมื่อของหมด แค่กดสับสวิตช์ (Toggle) ปุ๊บ นักศึกษาทุกคนจะเห็นว่าของหมดปั๊บทันที!
- **🎨 Impeccable Design:** UI/UX ที่ออกแบบมาอย่างพิถีพิถัน ใช้งานง่ายบนมือถือ

---

## 🛠 Tech Stack (Open Source Hackathon Ready!)
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS (Vanilla) + Framer Motion (สำหรับ Animations)
- **Backend / Database:** Supabase (PostgreSQL + Realtime + Storage)
- **Libraries:** `lucide-react` (Icons), `react-image-crop` (อัปโหลดรูป), `fuse.js` (Fuzzy Search)

---

## 🚀 Quick Start (วิธีติดตั้ง)

โปรเจกต์นี้ออกแบบมาให้ Clone และนำไปทดลองรันได้ง่ายที่สุด โดยไม่ต้อง Setup ระบบ Auth ให้วุ่นวาย (Vendor-lock free for Hackathons!)

### 1. Prerequisites
- Node.js (v18+)
- บัญชี [Supabase](https://supabase.com) (ฟรี)

### 2. Setup Supabase
1. สร้างโปรเจกต์ใหม่ใน Supabase
2. ไปที่ **SQL Editor** แล้วก๊อปปี้โค้ดจาก 3 ไฟล์นี้ไปรันตามลำดับ:
   - `schema.sql` (สร้างตาราง ร้านค้า และ เมนู)
   - `setup_storage.sql` (สร้าง Bucket สำหรับเก็บรูปภาพ)
   - `store_template.sql` (ใส่ข้อมูลร้านค้าและเมนูจำลอง เพื่อให้พร้อมใช้งานทันที)

### 3. Setup Project
```bash
# โคลนโปรเจกต์
git clone https://github.com/KiLLuKz/luerrai.git
cd luerrai

# ติดตั้ง Dependencies
npm install
```

### 4. Environment Variables
สร้างไฟล์ `.env` ไว้ที่ root ของโปรเจกต์ และใส่ค่า API Keys ที่ได้จาก Supabase:
```env
VITE_SUPABASE_URL=https://[YOUR_SUPABASE_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
```

### 5. Run it!
```bash
npm run dev
```
เข้าไปที่ `http://localhost:5173` เพื่อใช้งานระบบได้เลย!

---

## 💡 โครงสร้างโค้ด (สำหรับ Contributor)
- `/src/pages` - แบ่งชัดเจนระหว่าง `StudentView.tsx` (นักศึกษา) และ `MerchantView.tsx` (แม่ค้า)
- `/src/components` - แยก UI Components (Card, Alerts) ออกมาเพื่อให้ Reusable
- `/src/services/storeService.ts` - รวม Logic การเรียก Database ไว้ที่เดียว เพื่อให้คนอื่นสามารถเอาไปต่อยอดเปลี่ยน Backend เป็น Firebase หรือ DB อื่นได้ง่ายๆ
- `/src/config/supabaseClient.ts` - ตั้งค่าการเชื่อมต่อ Database

> **Made with ❤️ for Hackathons.** Feel free to fork and build upon it!
