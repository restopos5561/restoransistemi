const db = require('../config/db');

class SiparisDetay {
    // Belirli bir siparişin tüm detaylarını getir
    static async getBySiparisId(siparisId) {
        try {
            const query = `
                SELECT 
                    sd.*,
                    u.ad as urun_adi,
                    u.barkod,
                    u.birim,
                    k.ad as hazirlayan_ad,
                    k.soyad as hazirlayan_soyad
                FROM siparis_detaylari sd
                LEFT JOIN urunler u ON sd.urun_id = u.id
                LEFT JOIN kullanicilar k ON sd.hazirlayan_id = k.id
                WHERE sd.siparis_id = $1
                ORDER BY sd.olusturma_tarihi
            `;
            const result = await db.query(query, [siparisId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Sipariş detayları getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Belirli bir detayı getir
    static async getById(id) {
        try {
            const query = `
                SELECT 
                    sd.*,
                    u.ad as urun_adi,
                    u.barkod,
                    u.birim,
                    k.ad as hazirlayan_ad,
                    k.soyad as hazirlayan_soyad
                FROM siparis_detaylari sd
                LEFT JOIN urunler u ON sd.urun_id = u.id
                LEFT JOIN kullanicilar k ON sd.hazirlayan_id = k.id
                WHERE sd.id = $1
            `;
            const result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                throw new Error('Sipariş detayı bulunamadı');
            }

            return result.rows[0];
        } catch (error) {
            throw new Error(`Sipariş detayı getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Yeni sipariş detayı ekle
    static async create(detayData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                siparis_id,
                urun_id,
                miktar,
                not
            } = detayData;

            // Ürün bilgilerini al
            const urunQuery = 'SELECT fiyat FROM urunler WHERE id = $1';
            const urunResult = await client.query(urunQuery, [urun_id]);

            if (urunResult.rows.length === 0) {
                throw new Error('Ürün bulunamadı');
            }

            const birimFiyat = urunResult.rows[0].fiyat;
            const toplamTutar = birimFiyat * miktar;

            const query = `
                INSERT INTO siparis_detaylari (
                    siparis_id, urun_id, miktar, birim_fiyat,
                    toplam_tutar, not
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;

            const result = await client.query(query, [
                siparis_id,
                urun_id,
                miktar,
                birimFiyat,
                toplamTutar,
                not
            ]);

            await client.query('COMMIT');
            return await this.getById(result.rows[0].id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Sipariş detayı eklenirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Sipariş detayını güncelle
    static async update(id, detayData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                miktar,
                not,
                aktif,
                hazirlayan_id,
                hazirlama_suresi
            } = detayData;

            // Mevcut detayı kontrol et
            const mevcutDetay = await this.getById(id);
            if (!mevcutDetay) {
                throw new Error('Sipariş detayı bulunamadı');
            }

            let toplamTutar = mevcutDetay.toplam_tutar;
            if (miktar) {
                toplamTutar = mevcutDetay.birim_fiyat * miktar;
            }

            const query = `
                UPDATE siparis_detaylari
                SET 
                    miktar = COALESCE($1, miktar),
                    toplam_tutar = COALESCE($2, toplam_tutar),
                    not = COALESCE($3, not),
                    aktif = COALESCE($4, aktif),
                    hazirlayan_id = COALESCE($5, hazirlayan_id),
                    hazirlama_suresi = COALESCE($6, hazirlama_suresi),
                    guncelleme_tarihi = NOW()
                WHERE id = $7
                RETURNING *
            `;

            const result = await client.query(query, [
                miktar,
                toplamTutar,
                not,
                aktif,
                hazirlayan_id,
                hazirlama_suresi,
                id
            ]);

            await client.query('COMMIT');
            return await this.getById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Sipariş detayı güncellenirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Sipariş detayını sil
    static async delete(id) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                'DELETE FROM siparis_detaylari WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('Sipariş detayı bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Sipariş detayı silinirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Durumu güncelle
    static async updateDurum(id, yeniDurum, personelId, hazirlama_suresi = null) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const updateData = {
                aktif: yeniDurum,
                guncelleme_tarihi: new Date()
            };

            if (yeniDurum === 'hazirlaniyor') {
                updateData.hazirlayan_id = personelId;
            }

            if (hazirlama_suresi !== null) {
                updateData.hazirlama_suresi = hazirlama_suresi;
            }

            const query = `
                UPDATE siparis_detaylari
                SET ${Object.keys(updateData).map((key, i) => `${key} = $${i + 1}`).join(', ')}
                WHERE id = $${Object.keys(updateData).length + 1}
                RETURNING *
            `;

            const values = [...Object.values(updateData), id];
            const result = await client.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Sipariş detayı bulunamadı');
            }

            await client.query('COMMIT');
            return await this.getById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Sipariş detayı durumu güncellenirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }
}

module.exports = SiparisDetay; 