const db = require('../config/db');

class SiparisDurumGecmisi {
    // Tüm sipariş kayit_durum geçmişlerini getir
    static async getAll(filters = {}) {
        try {
            let query = `
                SELECT 
                    sdg.*,
                    k.ad as kullanici_adi
                FROM siparis_durum_gecmisi sdg
                LEFT JOIN kullanicilar k ON sdg.kullanici_id = k.id
                WHERE 1=1
            `;
            const values = [];
            let valueIndex = 1;

            if (filters.siparis_id) {
                query += ` AND sdg.siparis_id = $${valueIndex}`;
                values.push(filters.siparis_id);
                valueIndex++;
            }

            if (filters.kullanici_id) {
                query += ` AND sdg.kullanici_id = $${valueIndex}`;
                values.push(filters.kullanici_id);
                valueIndex++;
            }

            if (filters.kayit_durum) {
                query += ` AND sdg.yeni_durum = $${valueIndex}`;
                values.push(filters.kayit_durum);
                valueIndex++;
            }

            if (filters.baslangic_tarihi) {
                query += ` AND sdg.degisiklik_tarihi >= $${valueIndex}`;
                values.push(filters.baslangic_tarihi);
                valueIndex++;
            }

            if (filters.bitis_tarihi) {
                query += ` AND sdg.degisiklik_tarihi <= $${valueIndex}`;
                values.push(filters.bitis_tarihi);
                valueIndex++;
            }

            query += ' ORDER BY sdg.degisiklik_tarihi DESC';

            if (filters.limit) {
                query += ` LIMIT $${valueIndex}`;
                values.push(filters.limit);
                valueIndex++;
            }

            if (filters.offset) {
                query += ` OFFSET $${valueIndex}`;
                values.push(filters.offset);
            }

            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Sipariş kayit_durum geçmişleri getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Belirli bir sipariş kayit_durum geçmişini getir
    static async getById(id) {
        try {
            const query = `
                SELECT 
                    sdg.*,
                    k.ad as kullanici_adi
                FROM siparis_durum_gecmisi sdg
                LEFT JOIN kullanicilar k ON sdg.kullanici_id = k.id
                WHERE sdg.id = $1
            `;
            const result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                throw new Error('Sipariş kayit_durum geçmişi bulunamadı');
            }

            return result.rows[0];
        } catch (error) {
            throw new Error(`Sipariş kayit_durum geçmişi getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Yeni sipariş kayit_durum geçmişi oluştur
    static async create(gecmisData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                siparis_id,
                kullanici_id,
                eski_durum,
                yeni_durum,
                aciklama
            } = gecmisData;

            const query = `
                INSERT INTO siparis_durum_gecmisi (
                    siparis_id, kullanici_id, eski_durum, 
                    yeni_durum, aciklama
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;

            const result = await client.query(query, [
                siparis_id,
                kullanici_id,
                eski_durum,
                yeni_durum,
                aciklama
            ]);

            await client.query('COMMIT');
            return await this.getById(result.rows[0].id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Sipariş kayit_durum geçmişi oluşturulurken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Siparişe göre kayit_durum geçmişlerini getir
    static async getBySiparisId(siparisId) {
        try {
            const query = `
                SELECT 
                    sdg.*,
                    k.ad as kullanici_adi
                FROM siparis_durum_gecmisi sdg
                LEFT JOIN kullanicilar k ON sdg.kullanici_id = k.id
                WHERE sdg.siparis_id = $1
                ORDER BY sdg.degisiklik_tarihi DESC
            `;
            const result = await db.query(query, [siparisId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Sipariş kayit_durum geçmişleri getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Kullanıcıya göre kayit_durum geçmişlerini getir
    static async getByKullaniciId(kullaniciId) {
        try {
            const query = `
                SELECT 
                    sdg.*
                FROM siparis_durum_gecmisi sdg
                WHERE sdg.kullanici_id = $1
                ORDER BY sdg.degisiklik_tarihi DESC
            `;
            const result = await db.query(query, [kullaniciId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Kullanıcı sipariş kayit_durum geçmişleri getirilirken hata oluştu: ${error.message}`);
        }
    }
}

module.exports = SiparisDurumGecmisi; 