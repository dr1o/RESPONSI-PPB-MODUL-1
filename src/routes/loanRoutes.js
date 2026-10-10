import express from 'express';
import { LoanController } from '../controllers/loanController.js';

const router = express.Router();

// CRUD Peminjaman Buku + Filter Query (?status=Terlambat)
router.get('/', LoanController.getLoans);
router.get('/:id', LoanController.getLoanById);
router.post('/', LoanController.createLoan);
router.put('/:id', LoanController.updateLoan);
router.patch('/:id', LoanController.updateLoan);
router.delete('/:id', LoanController.deleteLoan);

export default router;