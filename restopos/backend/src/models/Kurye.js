const BaseModel = require('./BaseModel');
const db = require('../config/db');

class Kurye extends BaseModel {
    static tableName = 'kuryeler';

    static async getAll() {
        try {
            const query = `
                SELECT 
                    k.*,
                    (SELECT COUNT(*) FROM siparisler WHERE kurye_id = k.id AND aktif = 'yolda') as aktif_siparis_sayisi
                FROM ${this.tableName} k
                ORDER BY k.ad ASC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const query = `
                SELECT 
                    k.*,
                    (SELECT COUNT(*) FROM siparisler WHERE kurye_id = k.id AND aktif = 'yolda') as aktif_siparis_sayisi
                FROM ${this.tableName} k
                WHERE k.id = $1
            `;

            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getSiparisler(id) {
        try {
            const query = `
                SELECT 
                    s.*,
                    m.ad as musteri_adi,
                    m.telefon as musteri_telefon,
                    m.adres as teslimat_adresi
                FROM siparisler s
                LEFT JOIN musteriler m ON m.id = s.musteri_id
                WHERE s.kurye_id = $1
                ORDER BY s.olusturma_tarihi DESC
            `;

            const result = await db.query(query, [id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(data) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Telefon numarasının benzersiz olduğunu kontrol et
            const checkQuery = `
                SELECT id FROM ${this.tableName}
                WHERE telefon = $1
            `;
            const checkResult = await client.query(checkQuery, [data.telefon]);
            
            if (checkResult.rows.length > 0) {
                throw new Error('Bu telefon numarası zaten kullanılıyor');
            }

            // Yeni kurye oluştur
            const insertQuery = `
                INSERT INTO ${this.tableName} (
                    ad, soyad, telefon, aktif, notlar
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;

            const result = await client.query(insertQuery, [
                data.ad,
                data.soyad,
                data.telefon,
                data.aktif || 'aktif',
                data.notlar
            ]);

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async update(id, data) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Telefon numarasının benzersiz olduğunu kontrol et
            if (data.telefon) {
                const checkQuery = `
                    SELECT id FROM ${this.tableName}
                    WHERE telefon = $1 AND id != $2
                `;
                const checkResult = await client.query(checkQuery, [data.telefon, id]);
                
                if (checkResult.rows.length > 0) {
                    throw new Error('Bu telefon numarası zaten kullanılıyor');
                }
            }

            // Kuryeyi güncelle
            const updateQuery = `
                UPDATE ${this.tableName}
                SET 
                    ad = COALESCE($1, ad),
                    soyad = COALESCE($2, soyad),
                    telefon = COALESCE($3, telefon),
                    aktif = COALESCE($4, aktif),
                    notlar = COALESCE($5, notlar)
                WHERE id = $6
                RETURNING *
            `;

            const result = await client.query(updateQuery, [
                data.ad,
                data.soyad,
                data.telefon,
                data.aktif,
                data.notlar,
                id
            ]);

            if (result.rows.length === 0) {
                throw new Error('Kurye bulunamadı');
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

    static async updateDurum(id, aktif) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Kuryenin durumunu güncelle
            const updateQuery = `
                UPDATE ${this.tableName}
                SET aktif = $1
                WHERE id = $2
                RETURNING *
            `;

            const result = await client.query(updateQuery, [aktif, id]);

            if (result.rows.length === 0) {
                throw new Error('Kurye bulunamadı');
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

    static async delete(id) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Kuryenin aktif siparişi var mı kontrol et
            const checkQuery = `
                SELECT id FROM siparisler
                WHERE kurye_id = $1 AND aktif = 'yolda'
                LIMIT 1
            `;
            const checkResult = await client.query(checkQuery, [id]);
            
            if (checkResult.rows.length > 0) {
                throw new Error('Bu kurye silinemez çünkü aktif siparişleri var');
            }

            // Kuryeyi sil
            const deleteQuery = `
                DELETE FROM ${this.tableName}
                WHERE id = $1
                RETURNING *
            `;

            const result = await client.query(deleteQuery, [id]);

            if (result.rows.length === 0) {
                throw new Error('Kurye bulunamadı');
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
}

module.exports = Kurye; 