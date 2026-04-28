import { pool } from '../config/db.js';

export const LoanModel = {
  async getTopBorrowers() {
    const query = `
      SELECT 
          m.full_name AS "Data Anggota Lengkap", 
          COUNT(l.id) AS "Total Pinjaman",
          (
              SELECT b.title 
              FROM loans l2 
              JOIN books b ON l2.book_id = b.id 
              WHERE l2.member_id = m.id 
              GROUP BY b.title 
              ORDER BY COUNT(l2.id) DESC 
              LIMIT 1
          ) AS "Buku Favorit",
          MAX(l.loan_date) AS "Pinjaman Terakhir"
      FROM members m
      JOIN loans l ON m.id = l.member_id
      GROUP BY m.id, m.full_name
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
  }
};