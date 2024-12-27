const db = require('../config/db');

class FiyatDegisiklikLog {
    // Tüm fiyat değişiklik loglarını getir
    static async getAll(filters = {}) {
        try {
            let query = `
                SELECT 
                    fdl.*,
                    u.ad as urun_adi,
                    u.barkod,
                    u.birim,
                    k.ad as kullanici_adi
                FROM fiyat_degisiklik_log fdl
                LEFT JOIN urunler u ON fdl.urun_id = u.id
                LEFT JOIN kullanicilar k ON fdl.kullanici_id = k.id
                WHERE 1=1
            `;
            const values = [];
            let valueIndex = 1;

            if (filters.urun_id) {
                query += ` AND fdl.urun_id = $${valueIndex}`;
                values.push(filters.urun_id);
                valueIndex++;
            }

            if (filters.kullanici_id) {
                query += ` AND fdl.kullanici_id = $${valueIndex}`;
                values.push(filters.kullanici_id);
                valueIndex++;
            }

            if (filters.baslangic_tarihi) {
                query += ` AND fdl.degisiklik_tarihi >= $${valueIndex}`;
                values.push(filters.baslangic_tarihi);
                valueIndex++;
            }

            if (filters.bitis_tarihi) {
                query += ` AND fdl.degisiklik_tarihi <= $${valueIndex}`;
                values.push(filters.bitis_tarihi);
                valueIndex++;
            }

            query += ' ORDER BY fdl.degisiklik_tarihi DESC';

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
            throw new Error(`Fiyat değişiklik logları getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Belirli bir fiyat değişiklik logunu getir
    static async getById(id) {
        try {
            const query = `
                SELECT 
                    fdl.*,
                    u.ad as urun_adi,
                    u.barkod,
                    u.birim,
                    k.ad as kullanici_adi
                FROM fiyat_degisiklik_log fdl
                LEFT JOIN urunler u ON fdl.urun_id = u.id
                LEFT JOIN kullanicilar k ON fdl.kullanici_id = k.id
                WHERE fdl.id = $1
            `;
            const result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                throw new Error('Fiyat değişiklik logu bulunamadı');
            }

            return result.rows[0];
        } catch (error) {
            throw new Error(`Fiyat değişiklik logu getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Yeni fiyat değişiklik logu oluştur
    static async create(logData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                urun_id,
                kullanici_id,
                eski_fiyat,
                yeni_fiyat,
                aciklama
            } = logData;

            const query = `
                INSERT INTO fiyat_degisiklik_log (
                    urun_id, kullanici_id, eski_fiyat, 
                    yeni_fiyat, aciklama
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;

            const result = await client.query(query, [
                urun_id,
                kullanici_id,
                eski_fiyat,
                yeni_fiyat,
                aciklama
            ]);

            await client.query('COMMIT');
            return await this.getById(result.rows[0].id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Fiyat değişiklik logu oluşturulurken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Ürüne göre fiyat değişiklik loglarını getir
    static async getByUrunId(urunId) {
        try {
            const query = `
                SELECT 
                    fdl.*,
                    k.ad as kullanici_adi
                FROM fiyat_degisiklik_log fdl
                LEFT JOIN kullanicilar k ON fdl.kullanici_id = k.id
                WHERE fdl.urun_id = $1
                ORDER BY fdl.degisiklik_tarihi DESC
            `;
            const result = await db.query(query, [urunId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Ürün fiyat değişiklik logları getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Kullanıcıya göre fiyat değişiklik loglarını getir
    static async getByKullaniciId(kullaniciId) {
        try {
            const query = `
                SELECT 
                    fdl.*,
                    u.ad as urun_adi,
                    u.barkod,
                    u.birim
                FROM fiyat_degisiklik_log fdl
                LEFT JOIN urunler u ON fdl.urun_id = u.id
                WHERE fdl.kullanici_id = $1
                ORDER BY fdl.degisiklik_tarihi DESC
            `;
            const result = await db.query(query, [kullaniciId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Kullanıcı fiyat değişiklik logları getirilirken hata oluştu: ${error.message}`);
        }
    }
}

module.exports = FiyatDegisiklikLog; 