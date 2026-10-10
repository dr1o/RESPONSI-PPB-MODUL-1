import { supabase } from '../config/db.js';

export const AuthorModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('Penulis tidak ditemukan.');
    return data;
  },

  async create(name, nationality = 'Indonesia') {
    const { data, error } = await supabase
      .from('authors')
      .insert([{ name, nationality }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('authors')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('authors')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};