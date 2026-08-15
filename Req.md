# 📌 Project Requirements & Specifications: ระบบเช็กสถานะอาหารโรงอาหาร Real-time (MVP)

## 1. ข้อมูลภาพรวมของโปรเจกต์ (Overview)
* **เป้าหมาย:** สร้างเว็บแอปพลิเคชันสำหรับนักเรียนเพื่อเช็กสถานะเมนูอาหารในโรงอาหารแบบ Real-time ("เหลืออะไรบ้าง / หมดหรือยัง") พร้อมสอดแทรกกิมมิกมีม และมีแผงควบคุมสำหรับร้านค้าในการกดอัปเดตสถานะแบบรวดเร็ว
* **ระยะเวลา & ขอบเขต:** Hackathon MVP (มุ่งเน้น Core Flow ทำงานได้จริง ไม่เน้นฟีเจอร์ยิบย่อย)
* **Tech Stack หลัก:**
  * **Frontend:** React + TypeScript + Tailwind CSS (หรือ Vite/Next.js) + React Router
  * **Backend / Database:** Supabase (PostgreSQL + Realtime Subscription)
  * **State & Flow:** แยก Routing ชัดเจนโดย **ไม่ใช้ระบบ Authentication (No Auth)** เพื่อความรวดเร็วในการพัฒนาและ Demo

---

## 2. โครงสร้างเส้นทางและหน้าจอ (Routing & Pages)
1. **หน้าหลักนักเรียน (Student View) — Route: `/`**
   * แสดงรายการร้านค้าและเมนูอาหารทั้งหมด
   * แสดงสถานะความพร้อมของอาหาร (`เหลือ` / `หมด`) แบบ Real-time ทันทีที่มีการเปลี่ยนแปลง
   * มีลูกเล่น Meme Integration หรือข้อความกวนๆ แสดงผลตามสถานะของอาหาร
   * มีปุ่มค้นหา / ตัวกรองร้านค้าแบบเรียบง่าย

2. **หน้าจัดการร้านค้า (Merchant View) — Route: `/merchant` หรือ `/admin`**
   * **Store Switcher:** มี Dropdown เลือกร้านค้าที่ต้องการจัดการ (จำลองการสลับร้านค้าโดยไม่ต้อง Login)
   * **Store State Toggle:** สวิตช์กดเปิด-ปิดร้านค้า
   * **Menu Management:** รายการเมนูของร้านที่เลือก พร้อมปุ่มกด Toggle เปลี่ยนสถานะ `มีของ (Available)` / `ของหมด (Sold Out)` หรือปรับจำนวนจานที่เหลือ
   * เมื่อกดอัปเดต ต้องส่งข้อมูลไปเปลี่ยนที่ Supabase ทันที

---

## 3. โครงสร้างฐานข้อมูล (Database Schema - Supabase)
ใช้ 2 ตารางหลักที่เชื่อมความสัมพันธ์แบบ One-to-Many:

1. **ตาราง `stores` (ร้านค้า)**
   * `id`: BIGINT (Primary Key, Auto Increment)
   * `name`: TEXT (ชื่อร้าน)
   * `open_time`: TIME (เวลาเปิด)
   * `close_time`: TIME (เวลาปิด)
   * `is_open`: BOOLEAN (สถานะเปิด/ปิดร้าน, Default: true)
   * `created_at`: TIMESTAMPTZ (Default: NOW())

2. **ตาราง `menus` (เมนูอาหาร)**
   * `id`: BIGINT (Primary Key, Auto Increment)
   * `store_id`: BIGINT (Foreign Key อ้างอิงไปยัง `stores.id`)
   * `name`: TEXT (ชื่อเมนู)
   * `description`: TEXT (คำอธิบาย / มีมประจำเมนู)
   * `image_url`: TEXT (ลิงก์รูปภาพเมนู)
   * `price`: INT (ราคา)
   * `is_available`: BOOLEAN (สถานะมีของ/หมด, Default: true)
   * `remaining_count`: INT (จำนวนคงเหลือ)
   * `created_at`: TIMESTAMPTZ (Default: NOW())

---

## 4. ข้อกำหนดทางเทคนิคและการ Open Source
* รองรับ Supabase Realtime Channel สำหรับตาราง `stores` และ `menus`
* มีไฟล์ `schema.sql` และ `.env.example` เตรียมพร้อมสำหรับนำไปรันต่อได้ทันที
* มี Fallback Data / Mock State รองรับในกรณีที่ยังไม่ได้ต่อ Database หรือ Connection หลุด

---

## 🤖 คำสั่งสำหรับ AI Agent (Prompt for AI Agent)
> **คำสั่ง:** 
> ให้อ่าน Requirement ข้างต้นทั้งหมด จากนั้นให้ตอบกลับโดย:
> 1. **สร้างแผนการพัฒนา (Action Plan) แบบ Step-by-Step เป็นภาษาไทย** แบ่งเป็น Phase ที่ชัดเจน (เช่น Phase 1: Setup & DB, Phase 2: Core Components, Phase 3: Realtime Integration, Phase 4: Polish & Meme)
> 2. **สรุปโครงสร้างโฟลเดอร์ของโปรเจกต์ (Folder Structure)** ที่คลีนและเข้าใจง่าย
> 3. **รอการยืนยันแผนก่อนเริ่มเขียนโค้ดจริง**