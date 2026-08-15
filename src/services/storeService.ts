import { supabase } from '../config/supabaseClient';
import type { Store, Menu } from '../types';

export const storeService = {
  async getStores(): Promise<Store[]> {
    const { data, error } = await supabase.from('stores').select('*').order('id');
    if (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
    return data || [];
  },

  async getMenus(): Promise<Menu[]> {
    const { data, error } = await supabase.from('menus').select('*').order('id');
    if (error) {
      console.error('Error fetching menus:', error);
      return [];
    }
    return data || [];
  },

  async toggleMenuAvailability(menuId: number, isAvailable: boolean) {
    const { data, error } = await supabase
      .from('menus')
      .update({ is_available: isAvailable })
      .eq('id', menuId)
      .select();
    
    if (error) {
      console.error('Error updating menu availability:', error);
      throw error;
    }
    return data;
  },

  async createStore(name: string, openTime: string, closeTime: string) {
    const { data, error } = await supabase.from('stores').insert([{
      name, open_time: openTime, close_time: closeTime
    }]).select();
    if (error) throw error;
    return data[0];
  },

  async updateStore(id: number, updates: Partial<Store>) {
    const { data, error } = await supabase.from('stores').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  async createMenu(menu: Omit<Menu, 'id' | 'created_at'>) {
    const { data, error } = await supabase.from('menus').insert([menu]).select();
    if (error) throw error;
    return data[0];
  },

  async updateMenu(id: number, updates: Partial<Menu>) {
    const { data, error } = await supabase.from('menus').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  async deleteMenu(id: number) {
    const { error } = await supabase.from('menus').delete().eq('id', id);
    if (error) throw error;
  },

  async deleteStore(id: number) {
    const { error } = await supabase.from('stores').delete().eq('id', id);
    if (error) throw error;
  },

  async resetAllMenus(storeId: number) {
    const { error } = await supabase.from('menus').update({ is_available: true }).eq('store_id', storeId);
    if (error) throw error;
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `menu-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images') // Note: User needs to create a bucket named 'images'
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  }
};
