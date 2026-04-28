import express from 'express';
import { LoanController } from '../controllers/loanController.js';

const router = express.Router();

// This is the specific endpoint required by your assignment
router.get('/top-borrowers', LoanController.getTopBorrowers);

export default router;