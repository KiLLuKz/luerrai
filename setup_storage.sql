-- สร้าง Bucket ชื่อ "images" (ถ้ายังไม่มี)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- ลบนโยบายเก่า (เพื่อความชัวร์เวลาแก้)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Allow Authenticated Uploads" on storage.objects;
drop policy if exists "Allow Public Uploads (MVP)" on storage.objects;

-- อนุญาตให้ทุกคนอ่านไฟล์ใน Bucket 'images' ได้ (Public)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- สำหรับ MVP ตอนนี้ยังไม่มีระบบ Login 
-- จึงอนุญาตให้ทุกคนอัปโหลดและลบไฟล์ใน Bucket 'images' ได้ชั่วคราว
-- ⚠️ ข้อควรระวัง: หากจะเอาขึ้น Production จริงควรเปลี่ยนให้เฉพาะ Auth User ⚠️
create policy "Allow Public Uploads (MVP)"
on storage.objects for insert
with check ( bucket_id = 'images' );

create policy "Allow Public Updates (MVP)"
on storage.objects for update
using ( bucket_id = 'images' );

create policy "Allow Public Deletes (MVP)"
on storage.objects for delete
using ( bucket_id = 'images' );
