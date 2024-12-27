const fs = require('fs').promises;
const path = require('path');
const db = require('../config/db');

async function runMigrations() {
    try {
        // Migration dosyalarını oku
        const migrationsPath = path.join(__dirname, '../migrations');
        const files = await fs.readdir(migrationsPath);
        
        // SQL dosyalarını sırala
        const sqlFiles = files
            .filter(f => f.endsWith('.sql'))
            .sort((a, b) => {
                const numA = parseInt(a.split('_')[0]);
                const numB = parseInt(b.split('_')[0]);
                return numA - numB;
            });

        console.log('Migration dosyaları bulundu:', sqlFiles);

        // Her migration dosyasını sırayla çalıştır
        for (const file of sqlFiles) {
            console.log(`\nMigration çalıştırılıyor: ${file}`);
            const filePath = path.join(migrationsPath, file);
            const sql = await fs.readFile(filePath, 'utf-8');

            try {
                await db.query(sql);
                console.log(`✓ ${file} başarıyla uygulandı`);
            } catch (err) {
                console.error(`✗ ${file} uygulanırken hata oluştu:`, err.message);
                throw err;
            }
        }

        console.log('\nTüm migration\'lar başarıyla tamamlandı!');
    } catch (err) {
        console.error('Migration hatası:', err);
        process.exit(1);
    } finally {
        await db.end();
    }
}

// Migration'ları çalıştır
runMigrations(); 