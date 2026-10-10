import { supabase } from '../config/db.js';

export const BookModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('books')
      .select('*, authors(id, name, nationality), categories(id, name)')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('books')
      .select('*, authors(id, name, nationality), categories(id, name)')
      .eq('id', id)
      .single();

    if (error) throw new Error('Buku tidak ditemukan.');
    return data;
  },

  async create(payload) {
    const { isbn, title, author_id, category_id, total_copies = 1, available_copies } = payload;
    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          isbn,
          title,
          author_id: author_id || null,
          category_id: category_id || null,
          total_copies,
          available_copies: available_copies !== undefined ? available_copies : total_copies
        }
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('books')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};