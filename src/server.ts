// Import modul http dari Node.js
import * as http from 'http';

// Tentukan port yang akan digunakan. 
// Untuk latihan 4, jika kamu juga menjalankan server Bun secara bersamaan, 
// pastikan Bun menggunakan port berbeda (misal: 3001)[cite: 269].
const PORT = 3000;

// Buat server HTTP
const server = http.createServer((req, res) => {
    // [Latihan 3: Middleware Sederhana] Catat waktu saat request masuk 
    const startTime = Date.now();

    // Ambil URL dan metode HTTP dari objek request
    const url = req.url || '/';
    const method = req.method || 'GET';

    // Pisahkan query string (jika ada) agar percabangan routing kita lebih stabil
    const path = url.split('?')[0];

    // Tampilkan log di terminal saat request masuk
    console.log(`[${new Date().toLocaleTimeString()}] 📥 Menerima request: ${method} ${path}`);

    // [Latihan 3: Middleware Sederhana] 
    // Menangkap event 'finish' saat response selesai dikirim untuk menghitung lama eksekusi 
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toLocaleTimeString()}] 📤 Selesai: ${method} ${path} - Status: ${res.statusCode} (${duration}ms)\n`);
    });

    // --- ROUTING MANUAL DENGAN PERCABANGAN ---
    
    // Rute: GET /
    if (path === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Halaman Utama</h1><p>Selamat datang di server Node.js + TypeScript!</p>');
    }
    // Rute: GET /about
    else if (path === '/about' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Tentang Kami</h1><p>Ini adalah contoh routing manual sederhana.</p>');
    }
    // Rute: GET /api/users (mengembalikan data JSON)
    else if (path === '/api/users' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ]));
    }
    // Rute: POST /api/users (simulasi tambah user)
    else if (path === '/api/users' && method === 'POST') {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User berhasil dibuat (contoh)' }));
    }
    // [Latihan 1] Rute: GET /products (mengembalikan daftar produk JSON) [cite: 265]
    else if (path === '/products' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([
            { id: 1, name: "Laptop" },
            { id: 2, name: "Mouse" }
        ]));
    }
    // [Latihan 1] Rute: POST /products (simulasi tambah produk) 
    else if (path === '/products' && method === 'POST') {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Produk berhasil ditambahkan (simulasi)' }));
    }
    // [Latihan 2] Rute Parameter Dinamis: GET /users/:id 
    else if (path.startsWith('/users/') && method === 'GET') {
        // Parsing path dengan cara split('/') [cite: 267]
        // Contoh: '/users/123' akan menjadi ['','users','123']
        const parts = path.split('/');
        const userIdString = parts[2];

        // Memastikan ID ada di URL
        if (userIdString) {
            const id = parseInt(userIdString, 10);

            // Simulasi array data user statis [cite: 267]
            const mockUsers = [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' },
                { id: 123, name: 'John Doe' }
            ];

            // Cari user yang ID-nya cocok
            const userFound = mockUsers.find(u => u.id === id);

            if (userFound) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(userFound));
            } else {
                // Jika ID tidak ditemukan di array
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `User dengan ID ${id} tidak ditemukan.` }));
            }
        } else {
            // Jika format URL salah (misal hanya /users/)
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Format ID tidak valid.' }));
        }
    }
    // Jika tidak ada rute yang cocok -> 404 Not Found
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>❌ 404 Halaman Tidak Ditemukan</h1>');
    }
});

// Jalankan server, dengarkan di port yang ditentukan
server.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});