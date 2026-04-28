import { pool } from '../config/db.js';

export const LoanModel = {
  // Fungsi untuk mendapatkan Top 3 Peminjam dengan data lengkap
  async getTopBorrowers() {
    const query = `
      SELECT 
          m.id, 
          m.full_name, 
          m.email, 
          m.member_type, 
          m.joined_at,
          COUNT(l.id) AS "Total Pinjaman",
          MAX(l.loan_date) AS "Pinjaman Terakhir",
          (
              SELECT b.title 
              FROM loans l2 
              JOIN books b ON l2.book_id = b.id 
              WHERE l2.member_id = m.id 
              GROUP BY b.title 
              ORDER BY COUNT(l2.id) DESC 
              LIMIT 1
          ) AS "Buku Favorit"
      FROM members m
      JOIN loans l ON m.id = l.member_id
      GROUP BY m.id
      ORDER BY "Total Pinjaman" DESC
      LIMIT 3;
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getAllLoans() {
    const query = 'SELECT * FROM loans';
    const result = await pool.query(query);
    return result.rows;
  },

  async createLoan(book_id, member_id, due_date) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const bookCheck = await client.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
      if (bookCheck.rows[0].available_copies <= 0) {
        throw new Error('Buku sedang tidak tersedia (stok habis).');
      }
      await client.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [book_id]);
      const loanQuery = `
        INSERT INTO loans (book_id, member_id, due_date) 
        VALUES ($1, $2, $3) RETURNING *
      `;
      const result = await client.query(loanQuery, [book_id, member_id, due_date]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};