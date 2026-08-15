export interface Store {
  id: number;
  name: string;
  open_time: string;
  close_time: string;
  is_open: boolean;
}

export interface Menu {
  id: number;
  store_id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  is_available: boolean;
  remaining_count: number;
}
