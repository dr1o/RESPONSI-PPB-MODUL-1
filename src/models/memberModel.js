import { supabase } from '../config/db.js';

export const MemberModel = {
  async getAll() {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('Anggota tidak ditemukan.');
    return data;
  },

  async create(payload) {
    const { full_name, email, member_type = 'STUDENT' } = payload;
    const { data, error } = await supabase
      .from('members')
      .insert([{ full_name, email, member_type }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('members')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('members')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};