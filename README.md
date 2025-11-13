# SMP Akademik Management System

Aplikasi web manajemen akademik untuk **SMP** dengan dashboard berbeda berdasarkan **role**: Admin, Guru, dan Siswa.  
Dibangun menggunakan **React 18 (Vite)**, **TailwindCSS**, **Zustand**, dan **Supabase** sebagai backend (Auth, Database, Storage, Realtime).  

Aplikasi ini **responsif**, **adaptif**, mendukung **autosave real-time tanpa reload**, dan siap dijalankan sebagai **PWA**.

---

## 🌐 Live Demo

> Link demo live: [https://smp-akademik.vercel.app](https://smp-akademik.vercel.app)  

> Note: Supabase URL dan anon key harus disesuaikan dengan project Supabase kamu untuk demo live.

---

## 🧱 Teknologi

| Kategori | Teknologi |
|----------|-----------|
| Frontend | React 18 + Vite |
| UI | TailwindCSS, Lucide React Icons, Framer Motion |
| State Management | Zustand |
| Routing | React Router v6 |
| Backend | Supabase (Auth, Database, Storage, Realtime) |
| Realtime | Supabase Realtime + Autosave |
| Notifikasi | react-hot-toast |
| Build Tools | ESLint, Prettier |
| PWA | Service Worker + manifest.json |

---

## 🔑 Fitur Utama

### Autentikasi
- Login & Logout (Supabase Auth)
- Register Guru & Siswa
- Role-based redirect & route protection
- Session persist & autosave session

### Dashboard Role-based
#### Admin
- Dashboard: Statistik siswa, guru, kelas, grafik nilai
- CRUD Data Akademik: Siswa, Guru, Kelas
- Kelola Jadwal, Nilai, Absensi, Pengumuman
- Dashboard utama: Card statistik, grafik nilai, tabel pengumuman terbaru

#### Guru
- Dashboard: Jadwal hari ini, absensi terakhir, pengumuman
- Kelola Kelas & Siswa, Nilai & Absensi, Jadwal Mengajar
- Dashboard utama: Card statistik, tabel absensi terakhir, panel pengumuman

#### Siswa
- Dashboard: Nilai rata-rata, jadwal hari ini, pengumuman terbaru
- Lihat Jadwal Mingguan, Nilai & Absensi, Pengumuman

---

### Responsif & Adaptif
- **Desktop (≥1025px):** Sidebar kanan, bisa hide/unhide
- **Tablet (641–1024px):** Sidebar collapsible
- **Mobile (≤640px):** Bottom Navigation fixed di bawah

---

### Real-time & Reaktif
- Update Nilai, Absensi, Pengumuman secara realtime
- Autosave form data tanpa reload
- Toast notification untuk setiap aksi CRUD
- Offline Cache: data tetap tersimpan sementara bila koneksi putus
- PWA Ready: installable di HP

---

## 🗃️ Struktur Database (Supabase)

| Tabel | Kolom & Deskripsi |
|-------|------------------|
| **profiles** | `id, nama, role, avatar, email` |
| **guru** | `nip, nama, mapel, user_id` |
| **siswa** | `nis, nama, kelas_id, user_id` |
| **kelas** | `nama, wali_id` |
| **jadwal** | `hari, jam, mapel, guru_id, kelas_id` |
| **nilai** | `siswa_id, mapel, nilai, semester` |
| **absensi** | `siswa_id, tanggal, status` |
| **pengumuman** | `judul, isi, dibuat_oleh, created_at` |

> Semua data disimpan **langsung di Supabase** dan diambil **realtime tanpa reload** menggunakan Supabase Realtime subscription.

---

## 🧩 Struktur Folder Frontend

src/
┣ assets/
┣ components/
┃ ┣ layout/ # Header, Sidebar, BottomNav, Layout
┃ ┣ dashboard/ # CardStat, ChartNilai, QuickAction
┣ pages/
┃ ┣ auth/ # Login.jsx, Register.jsx
┃ ┣ admin/ # DashboardAdmin.jsx, DataAkademik.jsx, Jadwal.jsx, NilaiAbsensi.jsx, Pengumuman.jsx
┃ ┣ guru/ # DashboardGuru.jsx, KelasSiswa.jsx, NilaiAbsensi.jsx, Jadwal.jsx, Pengumuman.jsx
┃ ┗ siswa/ # DashboardSiswa.jsx, Jadwal.jsx, NilaiAbsensi.jsx, Pengumuman.jsx
┣ services/
┃ ┣ supabase.js
┃ ┗ api.js
┣ store/
┃ ┣ userStore.js
┃ ┗ uiStore.js
┣ hooks/
┃ ┗ useScreenSize.js
┣ utils/
┃ ┣ roleCheck.js
┃ ┗ formatDate.js
┣ App.jsx
┗ main.jsx


---

## ⚡ Instalasi & Setup

1. **Clone repository**
```bash
git clone https://github.com/username/smp-akademik.git
cd smp-akademik


Install dependencies

npm install


Setup environment variables (.env)

VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>


Jalankan aplikasi

npm run dev


Buka di browser

http://localhost:5173

🖼️ Screenshot / Preview
Admin Dashboard

Guru Dashboard

Siswa Dashboard

🔧 Cara Testing Supabase

Buat project baru di Supabase

Buat tabel sesuai Struktur Database di atas

Aktifkan Realtime pada tabel nilai, absensi, dan pengumuman

Masukkan Supabase URL & anon key di .env

Jalankan aplikasi → login → coba input data → harus langsung muncul tanpa reload

🏷️ Fitur Tambahan

Autosave data real-time (checkpoint)

Toast notification untuk aksi CRUD

PWA installable di HP

Mode gelap opsional via TailwindCSS

📜 Lisensi

MIT License © [Your Name]

🎯 Tujuan Proyek

Membangun sistem manajemen akademik SMP yang:

Modular, efisien, dan mudah dikembangkan

Cepat, ringan, dan real-time

Responsif di HP, tablet, dan desktop

UI profesional, lembut, dan efisien

Autosave data realtime tanpa reload

