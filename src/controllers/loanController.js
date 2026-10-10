import { LoanModel } from '../models/loanModel.js';

export const LoanController = {
  // GET /loans (mendukung query filter, misal: GET /loans?status=Terlambat)
  async getLoans(req, res) {
    try {
      const filters = {
        status: req.query.status,
        member_id: req.query.member_id,
        book_id: req.query.book_id,
        member_name: req.query.member_name,
        book_title: req.query.book_title
      };
      const loans = await LoanModel.getAllLoans(filters);
      res.status(200).json({
        status: 'success',
        count: loans.length,
        filters: Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined)
        ),
        data: loans
      });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  },

  // GET /loans/:id
  async getLoanById(req, res) {
    try {
      const loan = await LoanModel.getLoanById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: loan
      });
    } catch (err) {
      res.status(404).json({ status: 'error', error: err.message });
    }
  },

  // POST /loans
  async createLoan(req, res) {
    try {
      const loan = await LoanModel.createLoan(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Peminjaman buku berhasil dicatat!',
        data: loan
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  },

  // PUT /loans/:id & PATCH /loans/:id
  async updateLoan(req, res) {
    try {
      const updatedLoan = await LoanModel.updateLoan(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Data peminjaman berhasil diperbarui!',
        data: updatedLoan
      });
    } catch (err) {
      const statusCode = err.message.includes('tidak ditemukan') ? 404 : 400;
      res.status(statusCode).json({ status: 'error', error: err.message });
    }
  },

  // DELETE /loans/:id
  async deleteLoan(req, res) {
    try {
      const deletedLoan = await LoanModel.deleteLoan(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Data peminjaman berhasil dihapus!',
        data: deletedLoan
      });
    } catch (err) {
      const statusCode = err.message.includes('tidak ditemukan') ? 404 : 400;
      res.status(statusCode).json({ status: 'error', error: err.message });
    }
  }
};