# Panduan Deployment dengan PM2 & Nginx (Tanpa Docker)

Panduan ini untuk men-deploy aplikasi Frontend Meesha Store menggunakan PM2 dan Nginx di VPS.

## Prasyarat

1.  **Node.js & NPM** sudah terinstall (versi 18+ direkomendasikan).
2.  **PM2** sudah terinstall secara global (`npm install -g pm2`).
3.  **Nginx** sudah terinstall.
4.  **Git** sudah terinstall.

## Langkah 1: Setup Project

Masuk ke VPS dan ke direktori tujuan:

```bash
cd /var/www/frontend-meesha.store

# Jika folder belum ada, clone dulu:
# git clone https://github.com/ikromnur/frontend-meesha.store.git .
```

## Langkah 2: Update Kode

Ambil perubahan terbaru dari repository:

```bash
git pull origin main
```

## Langkah 3: Install Dependency & Build

Install package dan build aplikasi Next.js:

```bash
npm install
npm run build
```

## Langkah 4: Jalankan dengan PM2

Jalankan aplikasi menggunakan PM2. File `ecosystem.config.js` sudah disiapkan.

```bash
# Start aplikasi (pertama kali)
pm2 start ecosystem.config.js

# Simpan konfigurasi agar auto-start saat reboot
pm2 save
pm2 startup
```

Jika aplikasi sudah berjalan sebelumnya dan Anda ingin merestart setelah update:

```bash
pm2 reload frontend-meesha
# atau
pm2 restart frontend-meesha
```

## Langkah 5: Konfigurasi Nginx

Buat atau edit file konfigurasi Nginx:

```bash
sudo nano /etc/nginx/sites-available/meesha.store
```

Isi dengan konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name meesha.store www.meesha.store;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/meesha.store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Troubleshooting

Jika ada error, cek logs:

```bash
# Cek log PM2
pm2 logs frontend-meesha

# Cek status
pm2 status
```
