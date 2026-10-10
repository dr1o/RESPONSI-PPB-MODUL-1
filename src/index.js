import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root Endpoint (Health Check & Info Endpoint)
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Smart Library REST API is running!',
    endpoints: {
      loans: '/loans (atau /api/loans)',
      filter_loans_example: '/loans?status=Terlambat',
      books: '/books (atau /api/books)',
      members: '/members (atau /api/members)',
      authors: '/authors (atau /api/authors)',
      categories: '/categories (atau /api/categories)'
    }
  });
});

// Mount Routes pada root path (/loans, dll) dan /api/* agar kompatibel penuh
app.use('/loans', loanRoutes);
app.use('/api/loans', loanRoutes);

app.use('/books', bookRoutes);
app.use('/api/books', bookRoutes);

app.use('/members', memberRoutes);
app.use('/api/members', memberRoutes);

app.use('/authors', authorRoutes);
app.use('/api/authors', authorRoutes);

app.use('/categories', categoryRoutes);
app.use('/api/categories', categoryRoutes);

// Jalankan server lokal jika bukan di environment serverless Vercel
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
