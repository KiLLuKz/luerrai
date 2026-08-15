import type { Store, Menu } from '../types';

export const mockStores: Store[] = [
  {
    id: 1,
    name: "ป้าแต๋ว ตามสั่ง",
    open_time: "07:00",
    close_time: "15:00",
    is_open: true,
  },
  {
    id: 2,
    name: "ลุงชัย ก๋วยเตี๋ยวไก่",
    open_time: "07:00",
    close_time: "14:30",
    is_open: true,
  },
  {
    id: 3,
    name: "เจ๊หมวย น้ำปั่น",
    open_time: "08:00",
    close_time: "16:00",
    is_open: false,
  }
];

export const mockMenus: Menu[] = [
  // ร้านป้าแต๋ว
  {
    id: 1,
    store_id: 1,
    name: "ข้าวกะเพราหมูสับไข่ดาว",
    description: "สิ้นคิดแต่ไม่สิ้นใจ",
    image_url: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?w=500&auto=format&fit=crop&q=60",
    price: 45,
    is_available: true,
    remaining_count: 20,
  },
  {
    id: 2,
    store_id: 1,
    name: "ข้าวผัดหมู",
    description: "ผัดทีหอมไป 3 ซอย",
    image_url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=60",
    price: 40,
    is_available: false,
    remaining_count: 0,
  },
  // ร้านลุงชัย
  {
    id: 3,
    store_id: 2,
    name: "ก๋วยเตี๋ยวไก่มะระ",
    description: "มะระไม่ขม แต่ชีวิตรักผมขมมาก",
    image_url: "https://images.unsplash.com/photo-1594992520633-8758b299e503?w=500&auto=format&fit=crop&q=60",
    price: 45,
    is_available: true,
    remaining_count: 15,
  },
  {
    id: 4,
    store_id: 2,
    name: "เกาเหลาไก่",
    description: "สำหรับคนกลัวอ้วน (แต่กินข้าว 2 จาน)",
    image_url: "https://images.unsplash.com/photo-1594992520633-8758b299e503?w=500&auto=format&fit=crop&q=60", // Reusing image for mock
    price: 50,
    is_available: true,
    remaining_count: 5,
  },
  // ร้านเจ๊หมวย
  {
    id: 5,
    store_id: 3,
    name: "ชานมไข่มุก",
    description: "หวานร้อย ไข่มุกสองทัพพี",
    image_url: "https://images.unsplash.com/photo-1558855567-1a341be85b60?w=500&auto=format&fit=crop&q=60",
    price: 35,
    is_available: false,
    remaining_count: 0,
  }
];
