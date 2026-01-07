# Gunakan base image Node.js yang ringan
FROM node:20-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm ci

# Salin seluruh kode source
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "start"]
