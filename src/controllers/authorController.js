import { AuthorModel } from '../models/authorModel.js';

export const AuthorController = {
  async getAuthors(req, res) {
    try {
      const authors = await AuthorModel.getAll();
      res.status(200).json({ status: 'success', count: authors.length, data: authors });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  },

  async getAuthorById(req, res) {
    try {
      const author = await AuthorModel.getById(req.params.id);
      res.status(200).json({ status: 'success', data: author });
    } catch (err) {
      res.status(404).json({ status: 'error', error: err.message });
    }
  },

  async addAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      const author = await AuthorModel.create(name, nationality);
      res.status(201).json({
        status: 'success',
        message: 'Penulis berhasil ditambahkan!',
        data: author
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  },

  async updateAuthor(req, res) {
    try {
      const updated = await AuthorModel.update(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Data penulis berhasil diperbarui!',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  },

  async deleteAuthor(req, res) {
    try {
      const deleted = await AuthorModel.delete(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Penulis berhasil dihapus!',
        data: deleted
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  }
};