import { supabase } from '../config/db.js';

export const LoanModel = {
  // READ ALL (+ Filter Query contoh: ?status=Terlambat)
  async getAllLoans(filters = {}) {
    let query = supabase
      .from('loans')
      .select('*, books(id, title, isbn), members(id, full_name, email, member_type)')
      .order('id', { ascending: true });

    if (filters.status) {
      query = query.ilike('status', filters.status.trim());
    }
    if (filters.member_id) {
      query = query.eq('member_id', filters.member_id);
    }
    if (filters.book_id) {
      query = query.eq('book_id', filters.book_id);
    }
    if (filters.member_name) {
      query = query.ilike('member_name', `%${filters.member_name.trim()}%`);
    }
    if (filters.book_title) {
      query = query.ilike('book_title', `%${filters.book_title.trim()}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  },

  // READ BY ID
  async getLoanById(id) {
    const { data, error } = await supabase
      .from('loans')
      .select('*, books(id, title, isbn), members(id, full_name, email, member_type)')
      .eq('id', id)
      .single();

    if (error) throw new Error('Data peminjaman tidak ditemukan.');
    return data;
  },

  // CREATE LOAN
  async createLoan(payload) {
    const {
      book_id,
      member_id,
      book_title,
      member_name,
      borrower_name,
      loan_date,
      due_date,
      return_date,
      status = 'Dipinjam',
      notes
    } = payload;

    let resolvedBookTitle = book_title || null;
    let resolvedMemberName = member_name || borrower_name || null;

    // Jika book_id disertakan, cek ketersediaan buku & ambil judulnya
    if (book_id) {
      const { data: book, error: bookErr } = await supabase
        .from('books')
        .select('id, title, available_copies')
        .eq('id', book_id)
        .single();

      if (bookErr || !book) {
        throw new Error(`Buku dengan ID ${book_id} tidak ditemukan.`);
      }
      if (status !== 'Dikembalikan' && book.available_copies <= 0) {
        throw new Error('Buku sedang tidak tersedia (stok habis).');
      }
      if (!resolvedBookTitle) {
        resolvedBookTitle = book.title;
      }

      if (status !== 'Dikembalikan') {
        await supabase
          .from('books')
          .update({ available_copies: book.available_copies - 1 })
          .eq('id', book_id);
      }
    }

    // Jika member_id disertakan, ambil nama anggota
    if (member_id) {
      const { data: member, error: memberErr } = await supabase
        .from('members')
        .select('id, full_name')
        .eq('id', member_id)
        .single();

      if (memberErr || !member) {
        throw new Error(`Anggota dengan ID ${member_id} tidak ditemukan.`);
      }
      if (!resolvedMemberName) {
        resolvedMemberName = member.full_name;
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const defaultDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const insertPayload = {
      book_id: book_id || null,
      member_id: member_id || null,
      book_title: resolvedBookTitle,
      member_name: resolvedMemberName,
      loan_date: loan_date || today,
      due_date: due_date || defaultDueDate,
      return_date: return_date || null,
      status: status || 'Dipinjam',
      notes: notes || null
    };

    const { data, error } = await supabase
      .from('loans')
      .insert([insertPayload])
      .select('*, books(id, title, isbn), members(id, full_name, email, member_type)')
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // UPDATE LOAN
  async updateLoan(id, payload) {
    const existing = await this.getLoanById(id);

    const updateFields = {};
    const allowedFields = [
      'book_id',
      'member_id',
      'book_title',
      'member_name',
      'loan_date',
      'due_date',
      'return_date',
      'status',
      'notes'
    ];

    for (const field of allowedFields) {
      if (payload[field] !== undefined) {
        updateFields[field] = payload[field];
      }
    }
    if (payload.borrower_name !== undefined && updateFields.member_name === undefined) {
      updateFields.member_name = payload.borrower_name;
    }

    // Jika status berubah menjadi 'Dikembalikan', set return_date otomatis & kembalikan stok buku
    if (
      updateFields.status &&
      updateFields.status.toLowerCase() === 'dikembalikan' &&
      existing.status?.toLowerCase() !== 'dikembalikan'
    ) {
      if (!updateFields.return_date && !existing.return_date) {
        updateFields.return_date = new Date().toISOString().split('T')[0];
      }
      if (existing.book_id) {
        const { data: book } = await supabase
          .from('books')
          .select('available_copies')
          .eq('id', existing.book_id)
          .single();

        if (book) {
          await supabase
            .from('books')
            .update({ available_copies: book.available_copies + 1 })
            .eq('id', existing.book_id);
        }
      }
    }

    const { data, error } = await supabase
      .from('loans')
      .update(updateFields)
      .eq('id', id)
      .select('*, books(id, title, isbn), members(id, full_name, email, member_type)')
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // DELETE LOAN
  async deleteLoan(id) {
    const existing = await this.getLoanById(id);

    // Kembalikan stok buku jika peminjaman yang dihapus masih berstatus belum dikembalikan
    if (existing.book_id && existing.status?.toLowerCase() !== 'dikembalikan') {
      const { data: book } = await supabase
        .from('books')
        .select('available_copies')
        .eq('id', existing.book_id)
        .single();

      if (book) {
        await supabase
          .from('books')
          .update({ available_copies: book.available_copies + 1 })
          .eq('id', existing.book_id);
      }
    }

    const { data, error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};