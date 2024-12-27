const BaseModel = require('./BaseModel');
const db = require('../config/db');

class Kategori extends BaseModel {
    static tableName = 'urun_kategorileri';

    static async getAll() {
        try {
            const query = `
                SELECT 
                    k.*,
                    (SELECT COUNT(*) FROM urunler WHERE kategori_id = k.id) as urun_sayisi
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
                    (SELECT COUNT(*) FROM urunler WHERE kategori_id = k.id) as urun_sayisi
                FROM ${this.tableName} k
                WHERE k.id = $1
            `;

            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getUrunler(id) {
        try {
            const query = `
                SELECT 
                    u.*,
                    k.ad as kategori_adi
                FROM urunler u
                LEFT JOIN ${this.tableName} k ON k.id = u.kategori_id
                WHERE u.kategori_id = $1
                ORDER BY u.ad ASC
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

            // Kategori adının benzersiz olduğunu kontrol et
            const checkQuery = `
                SELECT id FROM ${this.tableName}
                WHERE LOWER(ad) = LOWER($1)
            `;
            const checkResult = await client.query(checkQuery, [data.ad]);
            
            if (checkResult.rows.length > 0) {
                throw new Error('Bu isimde bir kategori zaten mevcut');
            }

            // Yeni kategori oluştur
            const insertQuery = `
                INSERT INTO ${this.tableName} (
                    ad,
                    aciklama
                ) VALUES ($1, $2)
                RETURNING *
            `;

            const result = await client.query(insertQuery, [
                data.ad,
                data.aciklama
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

            // Kategori adının benzersiz olduğunu kontrol et
            const checkQuery = `
                SELECT id FROM ${this.tableName}
                WHERE LOWER(ad) = LOWER($1) AND id != $2
            `;
            const checkResult = await client.query(checkQuery, [data.ad, id]);
            
            if (checkResult.rows.length > 0) {
                throw new Error('Bu isimde bir kategori zaten mevcut');
            }

            // Kategoriyi güncelle
            const updateQuery = `
                UPDATE ${this.tableName}
                SET 
                    ad = COALESCE($1, ad),
                    aciklama = COALESCE($2, aciklama)
                WHERE id = $3
                RETURNING *
            `;

            const result = await client.query(updateQuery, [
                data.ad,
                data.aciklama,
                id
            ]);

            if (result.rows.length === 0) {
                throw new Error('Kategori bulunamadı');
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

            // Kategoriye bağlı ürün var mı kontrol et
            const checkQuery = `
                SELECT id FROM urunler
                WHERE kategori_id = $1
                LIMIT 1
            `;
            const checkResult = await client.query(checkQuery, [id]);
            
            if (checkResult.rows.length > 0) {
                throw new Error('Bu kategoriye bağlı ürünler var. Önce ürünleri silmelisiniz.');
            }

            // Kategoriyi sil
            const deleteQuery = `
                DELETE FROM ${this.tableName}
                WHERE id = $1
                RETURNING *
            `;

            const result = await client.query(deleteQuery, [id]);

            if (result.rows.length === 0) {
                throw new Error('Kategori bulunamadı');
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

module.exports = Kategori; 