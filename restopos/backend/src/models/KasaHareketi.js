const db = require('../config/db');

class KasaHareketi {
    // Tüm kasa hareketlerini getir
    static async getAll(filters = {}) {
        try {
            let query = `
                SELECT 
                    kh.*,
                    k.ad as kullanici_adi,
                    a.masa_id,
                    o.odeme_tipi as odeme_detay_tipi
                FROM kasa_hareketleri kh
                LEFT JOIN kullanicilar k ON kh.kullanici_id = k.id
                LEFT JOIN adisyonlar a ON kh.adisyon_id = a.id
                LEFT JOIN odemeler o ON kh.odeme_id = o.id
                WHERE 1=1
            `;
            const values = [];
            let valueIndex = 1;

            if (filters.hareket_tipi) {
                query += ` AND kh.hareket_tipi = $${valueIndex}`;
                values.push(filters.hareket_tipi);
                valueIndex++;
            }

            if (filters.odeme_tipi) {
                query += ` AND kh.odeme_tipi = $${valueIndex}`;
                values.push(filters.odeme_tipi);
                valueIndex++;
            }

            if (filters.baslangic_tarihi) {
                query += ` AND kh.olusturma_tarihi >= $${valueIndex}`;
                values.push(filters.baslangic_tarihi);
                valueIndex++;
            }

            if (filters.bitis_tarihi) {
                query += ` AND kh.olusturma_tarihi <= $${valueIndex}`;
                values.push(filters.bitis_tarihi);
                valueIndex++;
            }

            if (filters.kullanici_id) {
                query += ` AND kh.kullanici_id = $${valueIndex}`;
                values.push(filters.kullanici_id);
                valueIndex++;
            }

            query += ' ORDER BY kh.olusturma_tarihi DESC';

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
            throw new Error(`Kasa hareketleri getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Belirli bir kasa hareketini getir
    static async getById(id) {
        try {
            const query = `
                SELECT 
                    kh.*,
                    k.ad as kullanici_adi,
                    a.masa_id,
                    o.odeme_tipi as odeme_detay_tipi
                FROM kasa_hareketleri kh
                LEFT JOIN kullanicilar k ON kh.kullanici_id = k.id
                LEFT JOIN adisyonlar a ON kh.adisyon_id = a.id
                LEFT JOIN odemeler o ON kh.odeme_id = o.id
                WHERE kh.id = $1
            `;
            const result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                throw new Error('Kasa hareketi bulunamadı');
            }
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Kasa hareketi getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Yeni kasa hareketi oluştur
    static async create(data) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
                INSERT INTO kasa_hareketleri (
                    hareket_tipi, tutar, odeme_tipi, aciklama, 
                    referans_no, adisyon_id, odeme_id, kullanici_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;
            const values = [
                data.hareket_tipi,
                data.tutar,
                data.odeme_tipi,
                data.aciklama,
                data.referans_no,
                data.adisyon_id,
                data.odeme_id,
                data.kullanici_id
            ];

            const result = await client.query(query, values);
            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Kasa hareketi oluşturulurken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Kasa hareketi güncelle
    static async update(id, data) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
                UPDATE kasa_hareketleri 
                SET 
                    hareket_tipi = $1,
                    tutar = $2,
                    odeme_tipi = $3,
                    aciklama = $4,
                    referans_no = $5,
                    adisyon_id = $6,
                    odeme_id = $7,
                    kullanici_id = $8
                WHERE id = $9
                RETURNING *
            `;
            const values = [
                data.hareket_tipi,
                data.tutar,
                data.odeme_tipi,
                data.aciklama,
                data.referans_no,
                data.adisyon_id,
                data.odeme_id,
                data.kullanici_id,
                id
            ];

            const result = await client.query(query, values);
            
            if (result.rows.length === 0) {
                throw new Error('Kasa hareketi bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Kasa hareketi güncellenirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Kasa hareketi sil
    static async delete(id) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                'DELETE FROM kasa_hareketleri WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('Kasa hareketi bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Kasa hareketi silinirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Günlük kasa raporu
    static async getGunlukRapor(tarih) {
        try {
            const query = `
                SELECT 
                    odeme_tipi,
                    hareket_tipi,
                    COUNT(*) as islem_sayisi,
                    SUM(tutar) as toplam_tutar
                FROM kasa_hareketleri
                WHERE DATE(olusturma_tarihi) = DATE($1)
                GROUP BY odeme_tipi, hareket_tipi
                ORDER BY odeme_tipi, hareket_tipi
            `;
            const result = await db.query(query, [tarih]);
            return result.rows;
        } catch (error) {
            throw new Error(`Günlük kasa raporu alınırken hata oluştu: ${error.message}`);
        }
    }

    // Tarih aralığına göre kasa raporu
    static async getTarihAraligiRaporu(baslangic_tarihi, bitis_tarihi) {
        try {
            const query = `
                SELECT 
                    DATE(olusturma_tarihi) as tarih,
                    odeme_tipi,
                    hareket_tipi,
                    COUNT(*) as islem_sayisi,
                    SUM(tutar) as toplam_tutar
                FROM kasa_hareketleri
                WHERE olusturma_tarihi BETWEEN $1 AND $2
                GROUP BY DATE(olusturma_tarihi), odeme_tipi, hareket_tipi
                ORDER BY DATE(olusturma_tarihi), odeme_tipi, hareket_tipi
            `;
            const result = await db.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows;
        } catch (error) {
            throw new Error(`Tarih aralığı kasa raporu alınırken hata oluştu: ${error.message}`);
        }
    }

    // Kullanıcıya göre kasa hareketleri
    static async getByKullaniciId(kullaniciId) {
        try {
            const query = `
                SELECT 
                    kh.*,
                    k.ad as kullanici_adi,
                    a.masa_id,
                    o.odeme_tipi as odeme_detay_tipi
                FROM kasa_hareketleri kh
                LEFT JOIN kullanicilar k ON kh.kullanici_id = k.id
                LEFT JOIN adisyonlar a ON kh.adisyon_id = a.id
                LEFT JOIN odemeler o ON kh.odeme_id = o.id
                WHERE kh.kullanici_id = $1
                ORDER BY kh.olusturma_tarihi DESC
            `;
            const result = await db.query(query, [kullaniciId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Kullanıcı kasa hareketleri getirilirken hata oluştu: ${error.message}`);
        }
    }
}

module.exports = KasaHareketi; 