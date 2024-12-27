const fs = require('fs').promises;
const path = require('path');
const db = require('../config/db');

async function runMigration() {
    try {
        const migrationPath = path.join(__dirname, '../migrations/023_add_token_columns_to_kullanicilar.sql');
        const sql = await fs.readFile(migrationPath, 'utf8');
        
        await db.query(sql);
        console.log('Migration başarıyla çalıştırıldı');
        process.exit(0);
    } catch (error) {
        console.error('Migration hatası:', error);
        process.exit(1);
    }
}

runMigration(); 