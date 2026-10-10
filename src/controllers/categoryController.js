import { CategoryModel } from '../models/categoryModel.js';

export const CategoryController = {
  async getCategories(req, res) {
    try {
      const categories = await CategoryModel.getAll();
      res.status(200).json({ status: 'success', count: categories.length, data: categories });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  },

  async getCategoryById(req, res) {
    try {
      const category = await CategoryModel.getById(req.params.id);
      res.status(200).json({ status: 'success', data: category });
    } catch (err) {
      res.status(404).json({ status: 'error', error: err.message });
    }
  },

  async addCategory(req, res) {
    try {
      const category = await CategoryModel.create(req.body.name);
      res.status(201).json({
        status: 'success',
        message: 'Kategori berhasil ditambahkan!',
        data: category
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  },

  async updateCategory(req, res) {
    try {
      const updated = await CategoryModel.update(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Kategori berhasil diperbarui!',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  },

  async deleteCategory(req, res) {
    try {
      const deleted = await CategoryModel.delete(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Kategori berhasil dihapus!',
        data: deleted
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  }
};