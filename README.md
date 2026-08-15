# LuerRai (เหลือไร)

> "เดินไปโรงอาหารทีไร ของหมดทุกที... ปัญหานี้จะหมดไป!"
> "Walking to the canteen just to find out your food is sold out... Never again!"

[ภาษาไทย](#thai-version) | [English Version](#english-version)

---

<div id="thai-version"></div>

## ภาษาไทย

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
- **Store Management:** สร้างและจัดการร้านค้า ตั้งเวลาเปิด-ปิด (รูปแบบ 24H) พร้อมปุ่มเปิด/ปิดร้านด่วนชั่วคราว
- **Smart Image Cropper:** อัปโหลดและครอบตัดรูปภาพเมนูให้พอดีอัตราส่วน 4:3
- **1-Click Sold Out:** แค่กดสับสวิตช์สถานะ ระบบจะอัปเดตไปที่ผู้ใช้ทุกคนทันที
- **Optimistic UI & Undo Deletion:** ลบเมนูหรือร้านค้าได้อย่างลื่นไหล พร้อมระบบหน่วงเวลา 5 วินาทีให้กด Undo กู้คืนได้หากเผลอกดผิด
- **Impeccable Design:** UI/UX ที่สะอาดตา รองรับการใช้งานทั้ง Dark และ Light Mode

### Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

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
git clone https://github.com/KiLLuKz/luerrai.git
cd luerrai
npm install
```

**4. ตั้งค่าตัวแปร (Environment Variables)**
คัดลอกไฟล์ `.env.example` แล้วเปลี่ยนชื่อเป็น `.env` จากนั้นใส่ข้อมูลจาก Supabase ของคุณลงไป:
```env
VITE_SUPABASE_URL=https://[YOUR_SUPABASE_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
```

**5. สั่งรันโปรเจกต์**
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ `http://localhost:5173` เพื่อใช้งาน!

### การนำขึ้นระบบจริง (Deployment)
โปรเจกต์นี้ตั้งค่า Routing สำหรับ Single Page Application (SPA) เอาไว้ให้พร้อมนำขึ้น Hosting ยอดนิยมได้ทันที (เพื่อแก้ปัญหา Refresh แล้ว 404 Not Found):
- **Vercel:** นำขึ้นได้เลยทันที (ใช้การตั้งค่าจากไฟล์ `vercel.json`)
- **Netlify / Cloudflare Pages:** นำขึ้นได้เลยทันที (ใช้การตั้งค่าจากไฟล์ `public/_redirects`)
- **Nginx/Apache หรือ Hosting อื่นๆ:** ต้องทำการตั้งค่า URL Rewrite เพื่อส่งทราฟฟิกไปที่ `index.html` ด้วยตัวเอง

<br />

---

<div id="english-version"></div>

## English Version

**LuerRai** is a real-time web application designed for students and canteen vendors. It eliminates the frustration of walking to the canteen only to find out your favorite food is sold out by providing live status tracking for every menu item!

### Features

**Student View**
- **Real-time Menu Tracking:** Instant updates on menu availability without refreshing the page (Powered by Supabase Realtime).
- **Fuzzy Search & Autocomplete:** Quickly search for stores and dishes, even with typos.
- **Open Now Filter:** Easily filter for currently open vendors.
- **Favorite Store:** Save favorite stores for quick access.
- **Panic Gauge:** A live anxiety meter indicating overall canteen food stock status.
- **Gacha Button:** Randomize a meal selection when you cannot decide what to eat.
- **Live Commute Chat:** Real-time community chat with a built-in cooldown system to prevent spam.

**Merchant View**
- **Store Management:** Manage store details, operating hours (24H format), and a quick Open/Close override toggle.
- **Smart Image Cropper:** Upload and perfectly crop menu images to a 4:3 ratio.
- **1-Click Sold Out:** Instantly toggle item availability, updating all active users immediately.
- **Optimistic UI & Undo Deletion:** Smooth deletion flow with a 5-second undo toast to prevent accidental clicks.
- **Impeccable Design:** Responsive UI/UX with seamless Dark and Light Mode support.

### Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **Backend / Database:** Supabase (PostgreSQL + Realtime + Storage)
- **Libraries:** `lucide-react`, `react-image-crop`, `fuse.js`

### Quick Start

This project is designed to be easily cloned and run without complex authentication setups.

**1. Prerequisites**
- Node.js (v18+)
- [Supabase](https://supabase.com) Account

**2. Setup Supabase**
1. Create a new project in Supabase.
2. Go to the **SQL Editor** and execute the following scripts in order:
   - `schema.sql` (Creates required tables)
   - `setup_storage.sql` (Sets up the storage bucket)
   - `store_template.sql` (Populates initial mock data)

**3. Setup Project**
```bash
git clone https://github.com/KiLLuKz/luerrai.git
cd luerrai
npm install
```

**4. Environment Variables**
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://[YOUR_SUPABASE_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
```

**5. Run**
```bash
npm run dev
```
Visit `http://localhost:5173` to view the app!

### Deployment
This project includes pre-configured Single Page Application (SPA) routing to prevent **404 Not Found** errors upon page refresh:
- **Vercel:** Ready to deploy out of the box (uses `vercel.json`).
- **Netlify / Cloudflare Pages:** Ready to deploy out of the box (uses `public/_redirects`).
- **Other Providers (Nginx/Apache):** You will need to manually configure URL rewriting to fallback to `index.html`.
