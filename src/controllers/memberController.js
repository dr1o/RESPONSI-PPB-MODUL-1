import { MemberModel } from '../models/memberModel.js';

export const MemberController = {
  async getAllMembers(req, res) {
    try {
      const members = await MemberModel.getAll();
      res.status(200).json({ status: 'success', count: members.length, data: members });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  },

  async getMemberById(req, res) {
    try {
      const member = await MemberModel.getById(req.params.id);
      res.status(200).json({ status: 'success', data: member });
    } catch (err) {
      res.status(404).json({ status: 'error', error: err.message });
    }
  },

  async registerMember(req, res) {
    try {
      const newMember = await MemberModel.create(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Anggota berhasil didaftarkan!',
        data: newMember
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  },

  async updateMember(req, res) {
    try {
      const updated = await MemberModel.update(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Data anggota berhasil diperbarui!',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  },

  async deleteMember(req, res) {
    try {
      const deleted = await MemberModel.delete(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Anggota berhasil dihapus!',
        data: deleted
      });
    } catch (err) {
      res.status(400).json({ status: 'error', error: err.message });
    }
  }
};