const db = require('../config/db');
const SiparisDetay = require('./SiparisDetay');

class Siparis {
    // Tüm siparişleri getir
    static async getAll(filters = {}) {
        try {
            let query = `
                SELECT 
                    s.*,
                    m.numara as masa_numarasi,
                    k.ad as musteri_adi,
                    k.soyad as musteri_soyadi,
                    p.ad as personel_adi,
                    p.soyad as personel_soyadi
                FROM siparisler s
                LEFT JOIN masalar m ON s.masa_id = m.id
                LEFT JOIN cariler k ON s.musteri_id = k.id
                LEFT JOIN kullanicilar p ON s.personel_id = p.id
                WHERE 1=1
            `;
            const values = [];
            let valueIndex = 1;

            if (filters.aktif) {
                query += ` AND s.aktif = $${valueIndex}`;
                values.push(filters.aktif);
                valueIndex++;
            }

            if (filters.masa_id) {
                query += ` AND s.masa_id = $${valueIndex}`;
                values.push(filters.masa_id);
                valueIndex++;
            }

            if (filters.musteri_id) {
                query += ` AND s.musteri_id = $${valueIndex}`;
                values.push(filters.musteri_id);
                valueIndex++;
            }

            if (filters.baslangic_tarihi) {
                query += ` AND s.olusturma_tarihi >= $${valueIndex}`;
                values.push(filters.baslangic_tarihi);
                valueIndex++;
            }

            if (filters.bitis_tarihi) {
                query += ` AND s.olusturma_tarihi <= $${valueIndex}`;
                values.push(filters.bitis_tarihi);
                valueIndex++;
            }

            query += ' ORDER BY s.olusturma_tarihi DESC';

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
            throw new Error(`Siparişler getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Belirli bir siparişi getir
    static async getById(id) {
        try {
            const query = `
                SELECT 
                    s.*,
                    m.numara as masa_numarasi,
                    k.ad as musteri_adi,
                    k.soyad as musteri_soyadi,
                    p.ad as personel_adi,
                    p.soyad as personel_soyadi
                FROM siparisler s
                LEFT JOIN masalar m ON s.masa_id = m.id
                LEFT JOIN cariler k ON s.musteri_id = k.id
                LEFT JOIN kullanicilar p ON s.personel_id = p.id
                WHERE s.id = $1
            `;
            const result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                throw new Error('Sipariş bulunamadı');
            }

            const siparis = result.rows[0];
            siparis.detaylar = await SiparisDetay.getBySiparisId(id);

            return siparis;
        } catch (error) {
            throw new Error(`Sipariş getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Yeni sipariş oluştur
    static async create(siparisData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                masa_id,
                musteri_id,
                personel_id,
                not,
                detaylar
            } = siparisData;

            const query = `
                INSERT INTO siparisler (
                    masa_id, musteri_id, personel_id, not
                )
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;

            const result = await client.query(query, [
                masa_id,
                musteri_id,
                personel_id,
                not
            ]);

            const siparisId = result.rows[0].id;

            // Sipariş detaylarını ekle
            if (detaylar && detaylar.length > 0) {
                for (const detay of detaylar) {
                    await SiparisDetay.create({
                        ...detay,
                        siparis_id: siparisId
                    });
                }
            }

            await client.query('COMMIT');
            return await this.getById(siparisId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Sipariş oluşturulurken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Siparişi güncelle
    static async update(id, siparisData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                masa_id,
                musteri_id,
                not,
                aktif
            } = siparisData;

            const query = `
                UPDATE siparisler
                SET 
                    masa_id = COALESCE($1, masa_id),
                    musteri_id = COALESCE($2, musteri_id),
                    not = COALESCE($3, not),
                    aktif = COALESCE($4, aktif),
                    guncelleme_tarihi = NOW()
                WHERE id = $5
                RETURNING *
            `;

            const result = await client.query(query, [
                masa_id,
                musteri_id,
                not,
                aktif,
                id
            ]);

            if (result.rows.length === 0) {
                throw new Error('Sipariş bulunamadı');
            }

            await client.query('COMMIT');
            return await this.getById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Sipariş güncellenirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Siparişi sil
    static async delete(id) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Önce sipariş detaylarını sil
            await client.query('DELETE FROM siparis_detaylari WHERE siparis_id = $1', [id]);

            // Sonra siparişi sil
            const result = await client.query(
                'DELETE FROM siparisler WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('Sipariş bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Sipariş silinirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Durumu güncelle
    static async updateDurum(id, yeniDurum) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
                UPDATE siparisler
                SET 
                    aktif = $1,
                    guncelleme_tarihi = NOW()
                WHERE id = $2
                RETURNING *
            `;

            const result = await client.query(query, [yeniDurum, id]);

            if (result.rows.length === 0) {
                throw new Error('Sipariş bulunamadı');
            }

            await client.query('COMMIT');
            return await this.getById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Sipariş durumu güncellenirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Masaya göre aktif siparişleri getir
    static async getAktifSiparislerByMasaId(masaId) {
        try {
            const query = `
                SELECT 
                    s.*,
                    m.numara as masa_numarasi,
                    k.ad as musteri_adi,
                    k.soyad as musteri_soyadi,
                    p.ad as personel_adi,
                    p.soyad as personel_soyadi
                FROM siparisler s
                LEFT JOIN masalar m ON s.masa_id = m.id
                LEFT JOIN cariler k ON s.musteri_id = k.id
                LEFT JOIN kullanicilar p ON s.personel_id = p.id
                WHERE s.masa_id = $1 AND s.aktif = 'aktif'
                ORDER BY s.olusturma_tarihi DESC
            `;
            const result = await db.query(query, [masaId]);
            
            const siparisler = [];
            for (const siparis of result.rows) {
                siparis.detaylar = await SiparisDetay.getBySiparisId(siparis.id);
                siparisler.push(siparis);
            }

            return siparisler;
        } catch (error) {
            throw new Error(`masa siparişleri getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Müşteriye göre siparişleri getir
    static async getSiparislerByMusteriId(musteriId, limit = 10) {
        try {
            const query = `
                SELECT 
                    s.*,
                    m.numara as masa_numarasi,
                    k.ad as musteri_adi,
                    k.soyad as musteri_soyadi,
                    p.ad as personel_adi,
                    p.soyad as personel_soyadi
                FROM siparisler s
                LEFT JOIN masalar m ON s.masa_id = m.id
                LEFT JOIN cariler k ON s.musteri_id = k.id
                LEFT JOIN kullanicilar p ON s.personel_id = p.id
                WHERE s.musteri_id = $1
                ORDER BY s.olusturma_tarihi DESC
                LIMIT $2
            `;
            const result = await db.query(query, [musteriId, limit]);
            
            const siparisler = [];
            for (const siparis of result.rows) {
                siparis.detaylar = await SiparisDetay.getBySiparisId(siparis.id);
                siparisler.push(siparis);
            }

            return siparisler;
        } catch (error) {
            throw new Error(`Müşteri siparişleri getirilirken hata oluştu: ${error.message}`);
        }
    }
}

module.exports = Siparis; 