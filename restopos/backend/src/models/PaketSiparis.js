const db = require('../config/db');

class PaketSiparis {
    // Tüm paket siparişleri getir
    static async getAll(filters = {}) {
        try {
            let query = `
                SELECT 
                    ps.*,
                    c.ad as musteri_adi,
                    c.telefon as musteri_telefon,
                    c.adres as musteri_adres,
                    k.ad as kurye_adi
                FROM paket_siparisler ps
                LEFT JOIN cariler c ON ps.musteri_id = c.id
                LEFT JOIN cariler k ON ps.kurye_id = k.id
                WHERE 1=1
            `;
            const values = [];
            let valueIndex = 1;

            if (filters.aktif) {
                query += ` AND ps.aktif = $${valueIndex}`;
                values.push(filters.aktif);
                valueIndex++;
            }

            if (filters.musteri_id) {
                query += ` AND ps.musteri_id = $${valueIndex}`;
                values.push(filters.musteri_id);
                valueIndex++;
            }

            if (filters.kurye_id) {
                query += ` AND ps.kurye_id = $${valueIndex}`;
                values.push(filters.kurye_id);
                valueIndex++;
            }

            if (filters.baslangic_tarihi) {
                query += ` AND ps.olusturma_tarihi >= $${valueIndex}`;
                values.push(filters.baslangic_tarihi);
                valueIndex++;
            }

            if (filters.bitis_tarihi) {
                query += ` AND ps.olusturma_tarihi <= $${valueIndex}`;
                values.push(filters.bitis_tarihi);
                valueIndex++;
            }

            query += ' ORDER BY ps.olusturma_tarihi DESC';

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
            throw new Error(`paket siparişler getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Belirli bir paket siparişi getir
    static async getById(id) {
        try {
            const query = `
                SELECT 
                    ps.*,
                    c.ad as musteri_adi,
                    c.telefon as musteri_telefon,
                    c.adres as musteri_adres,
                    k.ad as kurye_adi,
                    k.telefon as kurye_telefon
                FROM paket_siparisler ps
                LEFT JOIN cariler c ON ps.musteri_id = c.id
                LEFT JOIN cariler k ON ps.kurye_id = k.id
                WHERE ps.id = $1
            `;
            const result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                throw new Error('paket sipariş bulunamadı');
            }

            return result.rows[0];
        } catch (error) {
            throw new Error(`paket sipariş getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Yeni paket sipariş oluştur
    static async create(siparisData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                musteri_id,
                kurye_id,
                teslimat_adresi,
                toplam_tutar,
                odeme_tipi,
                aktif,
                aciklama
            } = siparisData;

            const query = `
                INSERT INTO paket_siparisler (
                    musteri_id, kurye_id, teslimat_adresi, 
                    toplam_tutar, odeme_tipi, aktif, aciklama
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;

            const result = await client.query(query, [
                musteri_id,
                kurye_id,
                teslimat_adresi,
                toplam_tutar,
                odeme_tipi,
                aktif || 'hazirlaniyor',
                aciklama
            ]);

            await client.query('COMMIT');
            return await this.getById(result.rows[0].id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`paket sipariş oluşturulurken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // paket siparişi güncelle
    static async update(id, siparisData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                kurye_id,
                teslimat_adresi,
                toplam_tutar,
                odeme_tipi,
                aktif,
                aciklama
            } = siparisData;

            const query = `
                UPDATE paket_siparisler
                SET 
                    kurye_id = COALESCE($1, kurye_id),
                    teslimat_adresi = COALESCE($2, teslimat_adresi),
                    toplam_tutar = COALESCE($3, toplam_tutar),
                    odeme_tipi = COALESCE($4, odeme_tipi),
                    aktif = COALESCE($5, aktif),
                    aciklama = COALESCE($6, aciklama),
                    guncelleme_tarihi = NOW()
                WHERE id = $7
                RETURNING *
            `;

            const result = await client.query(query, [
                kurye_id,
                teslimat_adresi,
                toplam_tutar,
                odeme_tipi,
                aktif,
                aciklama,
                id
            ]);

            if (result.rows.length === 0) {
                throw new Error('paket sipariş bulunamadı');
            }

            await client.query('COMMIT');
            return await this.getById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`paket sipariş güncellenirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // paket siparişi sil
    static async delete(id) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                'DELETE FROM paket_siparisler WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('paket sipariş bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`paket sipariş silinirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Müşteriye göre paket siparişleri getir
    static async getByMusteriId(musteriId) {
        try {
            const query = `
                SELECT 
                    ps.*,
                    k.ad as kurye_adi,
                    k.telefon as kurye_telefon
                FROM paket_siparisler ps
                LEFT JOIN cariler k ON ps.kurye_id = k.id
                WHERE ps.musteri_id = $1
                ORDER BY ps.olusturma_tarihi DESC
            `;
            const result = await db.query(query, [musteriId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Müşteri paket siparişleri getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Kuryeye göre paket siparişleri getir
    static async getByKuryeId(kuryeId) {
        try {
            const query = `
                SELECT 
                    ps.*,
                    c.ad as musteri_adi,
                    c.telefon as musteri_telefon,
                    c.adres as musteri_adres
                FROM paket_siparisler ps
                LEFT JOIN cariler c ON ps.musteri_id = c.id
                WHERE ps.kurye_id = $1
                ORDER BY ps.olusturma_tarihi DESC
            `;
            const result = await db.query(query, [kuryeId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Kurye paket siparişleri getirilirken hata oluştu: ${error.message}`);
        }
    }
}

module.exports = PaketSiparis; 