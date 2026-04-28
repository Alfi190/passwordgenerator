# Modern Password Generator

Aplikasi web pembuat password yang elegan, aman, dan mudah digunakan. Dibuat menggunakan teknologi web standar (vanilla), aplikasi ini memprioritaskan keamanan sekaligus estetika.

## 🎮 Demo & Simulator

Lihat dan coba aplikasi secara langsung tanpa harus mengunduh kode:

- **[Live Preview (GitHub Pages)](https://Alfi190.github.io/passwordgenerator/)**
- **[Buka di StackBlitz](https://stackblitz.com/github/Alfi190/passwordgenerator)**
- **[Buka di CodeSandbox](https://codesandbox.io/s/github/Alfi190/passwordgenerator)**

## ✨ Fitur Utama

-   **Pembuatan Aman:** Menggunakan API `window.crypto` untuk menghasilkan nilai acak yang kuat secara kriptografis.
-   **Kustomisasi Penuh:** Pilihan untuk menyertakan huruf kecil, huruf besar, angka, dan simbol.
-   **Panjang Fleksibel:** Buat password dengan panjang mulai dari 6 hingga 32 karakter.
-   **Indikator Kekuatan Real-time:** Umpan balik visual tentang tingkat keamanan password beserta tips detail.
-   **Dukungan Mode Gelap:** Transisi halus antara tema terang dan gelap.
-   **Riwayat Password:** Menyimpan 5 password terakhir yang dibuat untuk akses cepat.
-   **Salin Sekali Klik:** Salin password ke papan klip dengan cepat disertai konfirmasi visual.
-   **Desain Responsif:** Optimal untuk tampilan desktop maupun perangkat seluler.

## 🚀 Teknologi yang Digunakan

-   **HTML5:** Struktur semantik.
-   **CSS3:** Layout modern (Flexbox), CSS Variables untuk tema, dan transisi halus.
-   **JavaScript (ES6+):** Logika utama, manipulasi DOM, dan fitur keamanan tanpa library eksternal.

## 🛠️ Instalasi & Penggunaan

Karena ini adalah aplikasi client-side, tidak diperlukan instalasi khusus.

1.  Clone atau unduh repositori ini.
2.  Buka file `index.html` di browser modern apa pun.
3.  Atur preferensi Anda dan klik tombol **Generate Password**.

## 🔒 Catatan Keamanan

Alat ini menggunakan algoritma **Fisher-Yates Shuffle** dan **Web Crypto API** untuk memastikan password tidak hanya acak, tetapi juga terdistribusi dengan baik dan tahan terhadap bias. Tidak ada data yang dikirim ke server; semua proses terjadi secara lokal di browser Anda.

