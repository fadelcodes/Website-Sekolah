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

