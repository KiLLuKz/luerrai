# LuerRai (เหลือไร)

> "เดินไปโรงอาหารทีไร ของหมดทุกที... ปัญหานี้จะหมดไป!"
> "Walking to the canteen just to find out your food is sold out... Never again!"

[🇹🇭 ภาษาไทย](#thai-version) | [🇬🇧 English Version](#english-version)

---

<div id="thai-version"></div>

## 🇹🇭 ภาษาไทย

**เหลือไร (LuerRai)** คือ Web Application สำหรับนักเรียนและพ่อค้าแม่ค้าในโรงอาหาร ที่ช่วยให้สามารถเช็คสถานะร้านค้าและเมนูอาหารได้แบบ **Real-time** ว่าเมนูโปรด "เหลือ" หรือ "หมด" ไปแล้ว จะได้ไม่ต้องเดินฝ่าแดดร้อนๆ ไปเก้ออีกต่อไป!

### ฟีเจอร์หลัก (Features)

**ฝั่งผู้ใช้งาน (Student View)**
- **Real-time Menu Tracking:** ดูสถานะเมนูอาหารได้ทันทีแบบไม่ต้องรีเฟรชหน้าจอ (Powered by Supabase Realtime)
- **Fuzzy Search & Autocomplete:** ค้นหาร้านหรือเมนูได้รวดเร็ว พิมพ์ผิดระบบก็ยังหาเจอ
- **Open Now Filter:** ตัวกรองเพื่อดูเฉพาะ "ร้านที่กำลังเปิดอยู่"
- **Favorite Store:** กดติดตามร้านโปรดไว้ดูสถานะได้ง่ายขึ้น
- **Panic Gauge:** หลอดวัดความตึงเครียด แสดงปริมาณอาหารที่เหลืออยู่ทั้งโรงอาหาร
- **Gacha Button:** ระบบสุ่มอาหารสำหรับคนที่คิดไม่ออกว่าจะกินอะไร
- **Live Commute Chat:** พื้นที่พูดคุยแบบ Real-time พร้อมระบบ Cooldown กันการสแปมข้อความ

**ฝั่งแม่ค้า (Merchant View)**
- **Store Management:** สร้างและจัดการร้านค้า ตั้งเวลาเปิด-ปิด (รูปแบบ 24H)
- **Smart Image Cropper:** อัปโหลดและครอบตัดรูปภาพเมนูให้พอดีอัตราส่วน 4:3
- **1-Click Sold Out:** แค่กดสับสวิตช์สถานะ ระบบจะอัปเดตไปที่ผู้ใช้ทุกคนทันที
- **Impeccable Design:** UI/UX ที่สะอาดตา รองรับการใช้งานทั้ง Dark และ Light Mode

### Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **Backend / Database:** Supabase (PostgreSQL + Realtime + Storage)
- **Libraries:** `lucide-react`, `react-image-crop`, `fuse.js`

### วิธีติดตั้ง (Quick Start)

โปรเจกต์นี้ออกแบบมาให้ Clone และทดลองรันได้ง่ายที่สุด โดยไม่ต้องตั้งค่าระบบ Auth ให้วุ่นวาย

**1. สิ่งที่ต้องมี (Prerequisites)**
- Node.js (v18 ขึ้นไป)
- บัญชี [Supabase](https://supabase.com)

**2. การตั้งค่า Supabase**
1. สร้างโปรเจกต์ใหม่ใน Supabase
2. ไปที่เมนู **SQL Editor** แล้วนำโค้ดไปรันตามลำดับดังนี้:
   - `schema.sql` (สร้างตาราง Database)
   - `setup_storage.sql` (สร้าง Bucket สำหรับรูปภาพ)
   - `store_template.sql` (เพิ่มข้อมูลจำลองเพื่อให้พร้อมใช้งาน)

**3. การตั้งค่าโปรเจกต์**
```bash
git clone [https://github.com/KiLLuKz/luerrai.git](https://github.com/KiLLuKz/luerrai.git)
cd luerrai
npm install
