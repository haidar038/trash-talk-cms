# Panduan Deployment ke Vercel

Berikut adalah panduan langkah demi langkah untuk melakukan deployment aplikasi ini ke Vercel.

## 1. Persiapan Proyek di Vercel

1.  **Daftar atau Masuk ke Vercel:**
    Buka [vercel.com](https://vercel.com) dan daftar jika Anda belum memiliki akun, atau masuk jika sudah punya.

2.  **Buat Proyek Baru:**
    *   Dari dashboard Vercel, klik tombol "**Add New...**" dan pilih "**Project**".
    *   Hubungkan akun Git Anda (GitHub, GitLab, atau Bitbucket) ke Vercel.
    *   Pilih repositori proyek ini dari daftar yang tersedia.

## 2. Konfigurasi Proyek

Vercel akan secara otomatis mendeteksi bahwa ini adalah proyek Vite dan melakukan konfigurasi awal. Anda bisa membiarkan konfigurasi default.

*   **Framework Preset:** Vite
*   **Build Command:** `npm run build` (atau `bun run build`)
*   **Output Directory:** `dist`
*   **Install Command:** `npm install` (atau `bun install`)

## 3. Konfigurasi Environment Variables

Aplikasi ini membutuhkan koneksi ke Supabase. Anda perlu menambahkan environment variables berikut ke proyek Vercel Anda:

1.  Di halaman konfigurasi proyek Vercel, buka tab "**Settings**" dan pilih "**Environment Variables**".
2.  Tambahkan dua variabel berikut:

    *   **Key:** `VITE_SUPABASE_URL`
        **Value:** URL proyek Supabase Anda. Anda bisa menemukannya di *Project Settings > API* di dashboard Supabase.

    *   **Key:** `VITE_SUPABASE_PUBLISHABLE_KEY`
        **Value:** Kunci *anon (public)* proyek Supabase Anda. Anda bisa menemukannya di *Project Settings > API* di dashboard Supabase.

    **Penting:** Pastikan untuk tidak menggunakan kunci `service_role` di sisi klien.

## 4. Lakukan Deployment

Setelah konfigurasi selesai, klik tombol "**Deploy**". Vercel akan memulai proses build dan deployment.

Setiap kali Anda melakukan `push` ke branch `main` (atau branch produksi yang Anda tentukan), Vercel akan secara otomatis membuat deployment produksi baru.

## 5. (Opsional) Tambahkan Custom Domain

Jika Anda memiliki domain sendiri, Anda bisa menghubungkannya dengan proyek ini:

1.  Di halaman proyek Vercel, buka tab "**Settings**" dan pilih "**Domains**".
2.  Masukkan nama domain Anda dan ikuti instruksi untuk mengkonfigurasi DNS.

Dengan mengikuti langkah-langkah di atas, aplikasi Anda akan berhasil di-deploy dan dapat diakses melalui URL yang disediakan oleh Vercel.
