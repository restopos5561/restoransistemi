const bcrypt = require('bcrypt');
const db = require('../config/db');

async function updateAdminPassword() {
    try {
        // Yeni hash oluştur
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        console.log('New hash:', hashedPassword);
        
        // Veritabanını güncelle
        await db.query(
            'UPDATE kullanicilar SET sifre = $1 WHERE email = $2',
            [hashedPassword, 'admin@restopos.com']
        );
        
        console.log('Admin password updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateAdminPassword(); 