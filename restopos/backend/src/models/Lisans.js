const db = require('../config/db');
const crypto = require('crypto');

class Lisans {
    static async get() {
        const query = `
            SELECT *
            FROM lisans
            WHERE id = 1
        `;
        const result = await db.query(query);
        
        if (result.rows.length === 0) {
            throw new Error('Lisans bilgileri bulunamadı');
        }

        return result.rows[0];
    }

    static async update(lisans) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                lisans_anahtari,
                musteri_adi,
                baslangic_tarihi,
                bitis_tarihi,
                ozellikler
            } = lisans;

            const query = `
                UPDATE lisans
                SET 
                    lisans_anahtari = $1,
                    musteri_adi = $2,
                    baslangic_tarihi = $3,
                    bitis_tarihi = $4,
                    ozellikler = $5,
                    guncelleme_tarihi = NOW()
                WHERE id = 1
                RETURNING *
            `;

            const result = await client.query(query, [
                lisans_anahtari,
                musteri_adi,
                baslangic_tarihi,
                bitis_tarihi,
                ozellikler
            ]);

            if (result.rows.length === 0) {
                throw new Error('Lisans bilgileri güncellenirken bir hata oluştu');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async validateLisansAnahtari(lisansAnahtari) {
        // Lisans anahtarını doğrula
        // Bu örnek implementasyonda basit bir hash kontrolü yapılıyor
        // Gerçek uygulamada daha güvenli bir doğrulama mekanizması kullanılmalı
        const hash = crypto.createHash('sha256')
            .update(lisansAnahtari)
            .digest('hex');

        const query = `
            SELECT COUNT(*) as count
            FROM lisans
            WHERE lisans_anahtari = $1
        `;
        const result = await db.query(query, [hash]);

        return result.rows[0].count > 0;
    }

    static async checkDurum() {
        const lisans = await this.get();
        const now = new Date();

        // Lisansın geçerlilik durumunu kontrol et
        const aktif = {
            aktif: now >= new Date(lisans.baslangic_tarihi) && now <= new Date(lisans.bitis_tarihi),
            kalan_gun: Math.ceil((new Date(lisans.bitis_tarihi) - now) / (1000 * 60 * 60 * 24)),
            ozellikler: lisans.ozellikler
        };

        return aktif;
    }

    static async checkOzellik(ozellik) {
        const lisans = await this.get();
        const aktif = await this.checkDurum();

        if (!aktif.aktif) {
            return false;
        }

        return lisans.ozellikler && lisans.ozellikler.includes(ozellik);
    }
}

module.exports = Lisans; 