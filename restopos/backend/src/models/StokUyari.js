const db = require('../config/db');

class StokUyari {
    // Tüm stok uyarılarını getir
    static async getAll(filters = {}) {
        try {
            let query = `
                SELECT 
                    su.*,
                    u.ad as urun_adi,
                    u.barkod,
                    u.birim
                FROM stok_uyarilari su
                LEFT JOIN urunler u ON su.urun_id = u.id
                WHERE 1=1
            `;
            const values = [];
            let valueIndex = 1;

            if (filters.aktif) {
                query += ` AND su.aktif = $${valueIndex}`;
                values.push(filters.aktif);
                valueIndex++;
            }

            if (filters.urun_id) {
                query += ` AND su.urun_id = $${valueIndex}`;
                values.push(filters.urun_id);
                valueIndex++;
            }

            query += ' ORDER BY su.olusturma_tarihi DESC';

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
            throw new Error(`stok uyarıları getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Belirli bir stok uyarısını getir
    static async getById(id) {
        try {
            const query = `
                SELECT 
                    su.*,
                    u.ad as urun_adi,
                    u.barkod,
                    u.birim
                FROM stok_uyarilari su
                LEFT JOIN urunler u ON su.urun_id = u.id
                WHERE su.id = $1
            `;
            const result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                throw new Error('stok uyarısı bulunamadı');
            }

            return result.rows[0];
        } catch (error) {
            throw new Error(`stok uyarısı getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Yeni stok uyarısı oluştur
    static async create(uyariData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                urun_id,
                miktar,
                aktif,
                aciklama
            } = uyariData;

            const query = `
                INSERT INTO stok_uyarilari (
                    urun_id, miktar, aktif, aciklama
                )
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;

            const result = await client.query(query, [
                urun_id,
                miktar,
                aktif || 'aktif',
                aciklama
            ]);

            await client.query('COMMIT');
            return await this.getById(result.rows[0].id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`stok uyarısı oluşturulurken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // stok uyarısını güncelle
    static async update(id, uyariData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                miktar,
                aktif,
                aciklama
            } = uyariData;

            const query = `
                UPDATE stok_uyarilari
                SET 
                    miktar = COALESCE($1, miktar),
                    aktif = COALESCE($2, aktif),
                    aciklama = COALESCE($3, aciklama),
                    guncelleme_tarihi = NOW()
                WHERE id = $4
                RETURNING *
            `;

            const result = await client.query(query, [
                miktar,
                aktif,
                aciklama,
                id
            ]);

            if (result.rows.length === 0) {
                throw new Error('stok uyarısı bulunamadı');
            }

            await client.query('COMMIT');
            return await this.getById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`stok uyarısı güncellenirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // stok uyarısını sil
    static async delete(id) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                'DELETE FROM stok_uyarilari WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('stok uyarısı bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`stok uyarısı silinirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Ürüne göre stok uyarılarını getir
    static async getByUrunId(urunId) {
        try {
            const query = `
                SELECT 
                    su.*,
                    u.ad as urun_adi,
                    u.barkod,
                    u.birim
                FROM stok_uyarilari su
                LEFT JOIN urunler u ON su.urun_id = u.id
                WHERE su.urun_id = $1
                ORDER BY su.olusturma_tarihi DESC
            `;
            const result = await db.query(query, [urunId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Ürün stok uyarıları getirilirken hata oluştu: ${error.message}`);
        }
    }
}

module.exports = StokUyari; 