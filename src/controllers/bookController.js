import { BookModel } from '../models/bookModel.js';

export const BookController = {
  async getAllBooks(req, res) {
    try {
      const books = await BookModel.getAll();
      res.status(200).json({ status: 'success', count: books.length, data: books });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  },

  async getBookById(req, res) {
    try {
      const book = await BookModel.getById(req.params.id);
      res.status(200).json({ status: 'success', data: book });
    } catch (err) {
      res.status(404).json({ status: 'error', error: err.message });
    }
  },

  async createBook(req, res) {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Buku berhasil ditambahkan!',
        data: newBook
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  },

  async updateBook(req, res) {
    try {
      const updated = await BookModel.update(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Data buku berhasil diperbarui!',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  },

  async deleteBook(req, res) {
    try {
      const deleted = await BookModel.delete(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Buku berhasil dihapus!',
        data: deleted
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  }
};
