# Smart Library API — Layanan Pencatatan Peminjaman Buku Perpustakaan

REST API berbasis **Node.js**, **Express.js**, dan **Supabase (PostgreSQL)** untuk mengelola layanan pencatatan peminjaman buku perpustakaan oleh anggota. Dibuat untuk memenuhi tugas **Responsi Praktikum PPB 2026**.

---

## 1. Deskripsi Umum & Tujuan Proyek

**Smart Library API** adalah layanan backend RESTful API yang dirancang untuk mempermudah pencatatan dan pengelolaan transaksi peminjaman buku di perpustakaan secara digital.

### Tujuan Proyek:
- Menyediakan layanan **CRUD (Create, Read, Update, Delete)** penuh untuk data peminjaman buku (`loans`), serta data pendukung seperti buku (`books`), anggota (`members`), penulis (`authors`), dan kategori (`categories`).
- Menyediakan fitur **filter query** pada data peminjaman (contoh: `GET /loans?status=Terlambat`, `GET /loans?status=Dipinjam`, `GET /loans?status=Dikembalikan`).
- Mengotomatisasi manajemen ketersediaan stok buku (`available_copies`) saat buku dipinjam maupun saat dikembalikan.
- Menyediakan endpoint publik yang di-deploy menggunakan **Vercel** dan terhubung dengan cloud database **Supabase**.

### Teknologi yang Digunakan:
- **Runtime & Framework:** Node.js & Express.js (`v5.x`)
- **Database:** Supabase (PostgreSQL) via `@supabase/supabase-js`
- **Deployment:** Vercel Serverless Functions

---

## 2. Link Hasil Deployment Vercel

- **Base URL Production (Vercel):** `https://<NAMA-PROJECT-ANDA>.vercel.app` *(Ganti dengan URL Vercel setelah deploy)*
- **Endpoint Utama Peminjaman:** `https://<NAMA-PROJECT-ANDA>.vercel.app/loans`
- **Contoh Filter Status Terlambat:** `https://<NAMA-PROJECT-ANDA>.vercel.app/loans?status=Terlambat`

> **Catatan:** Seluruh endpoint dapat diakses melalui prefix langsung (misal `/loans`) maupun dengan prefix `/api` (misal `/api/loans`).

---

## 3. Struktur Data / Schema Database

Skema lengkap beserta data awal (*seed data*) telah disediakan pada file [`supabase_schema.sql`](./supabase_schema.sql).

### A. Tabel `loans` (Tabel Utama Peminjaman Buku)
| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `BIGINT (PK)` | ID unik transaksi peminjaman (Auto Increment) |
| `book_id` | `BIGINT (FK)` | Referensi ID buku dari tabel `books` (Opsional/Nullable) |
| `member_id` | `BIGINT (FK)` | Referensi ID anggota dari tabel `members` (Opsional/Nullable) |
| `book_title` | `VARCHAR(255)` | Judul buku yang dipinjam (Otomatis terisi jika `book_id` dikirim) |
| `member_name` | `VARCHAR(150)` | Nama anggota peminjam (Otomatis terisi jika `member_id` dikirim) |
| `loan_date` | `DATE` | Tanggal peminjaman (Default: tanggal hari ini `CURRENT_DATE`) |
| `due_date` | `DATE` | Batas tanggal pengembalian buku |
| `return_date` | `DATE` | Tanggal buku dikembalikan (`NULL` jika belum dikembalikan) |
| `status` | `VARCHAR(50)` | Status peminjaman: `'Dipinjam'`, `'Dikembalikan'`, atau `'Terlambat'` |
| `notes` | `TEXT` | Catatan tambahan peminjaman |
| `created_at` | `TIMESTAMPTZ` | Waktu pencatatan data |

### B. Tabel `books` (Data Buku)
| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `BIGINT (PK)` | ID unik buku |
| `isbn` | `VARCHAR(50)` | Nomor ISBN buku (Unique) |
| `title` | `VARCHAR(255)` | Judul buku |
| `author_id` | `BIGINT (FK)` | Referensi ID penulis (`authors.id`) |
| `category_id` | `BIGINT (FK)` | Referensi ID kategori (`categories.id`) |
| `total_copies` | `INT` | Total eksemplar buku |
| `available_copies`| `INT` | Jumlah eksemplar yang tersedia untuk dipinjam |

### C. Tabel `members` (Data Anggota)
| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `BIGINT (PK)` | ID unik anggota |
| `full_name` | `VARCHAR(150)` | Nama lengkap anggota |
| `email` | `VARCHAR(150)` | Alamat email anggota (Unique) |
| `member_type` | `VARCHAR(50)` | Tipe anggota (`STUDENT`, `LECTURER`, dll.) |
| `joined_at` | `TIMESTAMPTZ` | Tanggal bergabung |

---

## 4. Contoh Request dan Response

### A. Ambil Semua Data Peminjaman (`GET /loans`)
- **Method:** `GET`
- **URL:** `/loans` (atau `/api/loans`)
- **Response (`200 OK`):**
```json
{
  "status": "success",
  "count": 2,
  "filters": {},
  "data": [
    {
      "id": 1,
      "book_id": 1,
      "member_id": 1,
      "book_title": "Laskar Pelangi",
      "member_name": "Budi Santoso",
      "loan_date": "2026-10-01",
      "due_date": "2026-10-08",
      "return_date": null,
      "status": "Terlambat",
      "notes": "Melewati batas waktu pengembalian",
      "books": {
        "id": 1,
        "title": "Laskar Pelangi",
        "isbn": "978-979-3062-79-2"
      },
      "members": {
        "id": 1,
        "full_name": "Budi Santoso",
        "email": "budi.santoso@students.ac.id",
        "member_type": "STUDENT"
      }
    }
  ]
}
```

---

### B. Filter Peminjaman Berdasarkan Query (`GET /loans?status=Terlambat`)
Mendukung query parameter `status` (`Dipinjam`, `Terlambat`, `Dikembalikan`), `member_id`, `book_id`, `member_name`, dan `book_title`.
- **Method:** `GET`
- **URL:** `/loans?status=Terlambat`
- **Response (`200 OK`):**
```json
{
  "status": "success",
  "count": 2,
  "filters": {
    "status": "Terlambat"
  },
  "data": [
    {
      "id": 1,
      "book_id": 1,
      "member_id": 1,
      "book_title": "Laskar Pelangi",
      "member_name": "Budi Santoso",
      "loan_date": "2026-10-01",
      "due_date": "2026-10-08",
      "return_date": null,
      "status": "Terlambat",
      "notes": "Melewati batas waktu pengembalian"
    },
    {
      "id": 3,
      "book_id": 3,
      "member_id": 3,
      "book_title": "Bumi Manusia",
      "member_name": "Andi Pratama",
      "loan_date": "2026-09-25",
      "due_date": "2026-10-02",
      "return_date": null,
      "status": "Terlambat",
      "notes": "Belum dikembalikan oleh peminjam"
    }
  ]
}
```

---

### C. Ambil Detail Peminjaman Berdasarkan ID (`GET /loans/:id`)
- **Method:** `GET`
- **URL:** `/loans/1`
- **Response (`200 OK`):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "book_id": 1,
    "member_id": 1,
    "book_title": "Laskar Pelangi",
    "member_name": "Budi Santoso",
    "loan_date": "2026-10-01",
    "due_date": "2026-10-08",
    "return_date": null,
    "status": "Terlambat",
    "notes": "Melewati batas waktu pengembalian"
  }
}
```

---

### D. Tambah Peminjaman Buku Baru (`POST /loans`)
Dapat mengirimkan `book_id` & `member_id` (relasional) **atau** langsung mengirimkan `book_title` & `member_name`.
- **Method:** `POST`
- **URL:** `/loans`
- **Request Body (`application/json`):**
```json
{
  "book_id": 1,
  "member_id": 2,
  "loan_date": "2026-10-10",
  "due_date": "2026-10-17",
  "status": "Dipinjam",
  "notes": "Peminjaman buku untuk referensi tugas"
}
```
- **Response (`201 Created`):**
```json
{
  "status": "success",
  "message": "Peminjaman buku berhasil dicatat!",
  "data": {
    "id": 5,
    "book_id": 1,
    "member_id": 2,
    "book_title": "Laskar Pelangi",
    "member_name": "Siti Aminah",
    "loan_date": "2026-10-10",
    "due_date": "2026-10-17",
    "return_date": null,
    "status": "Dipinjam",
    "notes": "Peminjaman buku untuk referensi tugas"
  }
}
```

---

### E. Perbarui Data / Status Peminjaman (`PUT /loans/:id` atau `PATCH /loans/:id`)
Jika `status` diubah menjadi `"Dikembalikan"`, sistem otomatis mengisi `return_date` dengan tanggal hari ini dan mengembalikan stok `available_copies` buku.
- **Method:** `PUT`
- **URL:** `/loans/5`
- **Request Body (`application/json`):**
```json
{
  "status": "Dikembalikan",
  "notes": "Buku telah dikembalikan tepat waktu"
}
```
- **Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Data peminjaman berhasil diperbarui!",
  "data": {
    "id": 5,
    "book_id": 1,
    "member_id": 2,
    "book_title": "Laskar Pelangi",
    "member_name": "Siti Aminah",
    "loan_date": "2026-10-10",
    "due_date": "2026-10-17",
    "return_date": "2026-10-10",
    "status": "Dikembalikan",
    "notes": "Buku telah dikembalikan tepat waktu"
  }
}
```

---

### F. Hapus Data Peminjaman (`DELETE /loans/:id`)
- **Method:** `DELETE`
- **URL:** `/loans/5`
- **Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Data peminjaman berhasil dihapus!",
  "data": {
    "id": 5,
    "book_id": 1,
    "member_id": 2,
    "book_title": "Laskar Pelangi",
    "member_name": "Siti Aminah",
    "status": "Dikembalikan"
  }
}
```

---

### G. Daftar Endpoint Pendukung Lainnya
Selain `/loans`, API ini juga mendukung operasi CRUD penuh (`GET`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id`) pada entitas berikut:
- **Books:** `/books` (atau `/api/books`)
- **Members:** `/members` (atau `/api/members`)
- **Authors:** `/authors` (atau `/api/authors`)
- **Categories:** `/categories` (atau `/api/categories`)

---

## 5. Panduan Instalasi & Cara Menjalankan Lokal

### Prasyarat:
- **Node.js** (v18 atau lebih baru)
- Akun & Project **Supabase**

### Langkah-langkah:

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/dr1o/RESPONSI-PPB-MODUL-1.git
   cd RESPONSI-PPB-MODUL-1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Siapkan Database di Supabase:**
   - Buka dashboard [Supabase](https://supabase.com) dan buat project baru.
   - Masuk ke menu **SQL Editor** → klik **New Query**.
   - Salin seluruh isi file [`supabase_schema.sql`](./supabase_schema.sql), tempelkan ke editor, lalu klik **Run**.

4. **Konfigurasi Environment Variables (`.env`):**
   - Salin file `.env.example` menjadi `.env`:
     ```bash
     cp .env.example .env
     ```
   - Isi `SUPABASE_URL` dan `SUPABASE_KEY` (ambil dari menu **Project Settings → Data API** di Supabase):
     ```env
     SUPABASE_URL=https://xxxx.supabase.co
     SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     PORT=3000
     ```

5. **Jalankan server di lokal:**
   ```bash
   # Mode development (auto-reload dengan nodemon)
   npm run dev

   # Mode production
   npm start
   ```

6. **Uji Endpoint di Browser / Postman:**
   - Buka `http://localhost:3000`
   - Uji daftar peminjaman: `http://localhost:3000/loans`
   - Uji filter status terlambat: `http://localhost:3000/loans?status=Terlambat`
