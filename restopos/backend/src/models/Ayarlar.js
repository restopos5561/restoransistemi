const db = require('../config/db');

class Ayarlar {
    static async get() {
        const query = `
            SELECT *
            FROM ayarlar
            WHERE id = 1
        `;
        const result = await db.query(query);
        
        if (result.rows.length === 0) {
            throw new Error('Ayarlar bulunamadı');
        }

        return result.rows[0];
    }

    static async update(ayarlar) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const {
                restoran_adi,
                adres,
                telefon,
                vergi_no,
                vergi_dairesi,
                logo_url,
                tema,
                dil,
                para_birimi,
                kdv_orani,
                servis_bedeli_orani,
                min_stok_uyari_seviyesi
            } = ayarlar;

            const query = `
                UPDATE ayarlar
                SET 
                    restoran_adi = COALESCE($1, restoran_adi),
                    adres = COALESCE($2, adres),
                    telefon = COALESCE($3, telefon),
                    vergi_no = COALESCE($4, vergi_no),
                    vergi_dairesi = COALESCE($5, vergi_dairesi),
                    logo_url = COALESCE($6, logo_url),
                    tema = COALESCE($7, tema),
                    dil = COALESCE($8, dil),
                    para_birimi = COALESCE($9, para_birimi),
                    kdv_orani = COALESCE($10, kdv_orani),
                    servis_bedeli_orani = COALESCE($11, servis_bedeli_orani),
                    min_stok_uyari_seviyesi = COALESCE($12, min_stok_uyari_seviyesi),
                    guncelleme_tarihi = NOW()
                WHERE id = 1
                RETURNING *
            `;

            const result = await client.query(query, [
                restoran_adi,
                adres,
                telefon,
                vergi_no,
                vergi_dairesi,
                logo_url,
                tema,
                dil,
                para_birimi,
                kdv_orani,
                servis_bedeli_orani,
                min_stok_uyari_seviyesi
            ]);

            if (result.rows.length === 0) {
                throw new Error('Ayarlar güncellenirken bir hata oluştu');
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

    static async updateYaziciAyarlari(yaziciAyarlari) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
                UPDATE ayarlar
                SET 
                    yazici_ayarlari = $1,
                    guncelleme_tarihi = NOW()
                WHERE id = 1
                RETURNING *
            `;

            const result = await client.query(query, [yaziciAyarlari]);

            if (result.rows.length === 0) {
                throw new Error('Yazıcı ayarları güncellenirken bir hata oluştu');
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

    static async updateEmailAyarlari(emailAyarlari) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
                UPDATE ayarlar
                SET 
                    email_ayarlari = $1,
                    guncelleme_tarihi = NOW()
                WHERE id = 1
                RETURNING *
            `;

            const result = await client.query(query, [emailAyarlari]);

            if (result.rows.length === 0) {
                throw new Error('Email ayarları güncellenirken bir hata oluştu');
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

    static async updateSmsAyarlari(smsAyarlari) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
                UPDATE ayarlar
                SET 
                    sms_ayarlari = $1,
                    guncelleme_tarihi = NOW()
                WHERE id = 1
                RETURNING *
            `;

            const result = await client.query(query, [smsAyarlari]);

            if (result.rows.length === 0) {
                throw new Error('SMS ayarları güncellenirken bir hata oluştu');
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

module.exports = Ayarlar; 