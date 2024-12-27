const BaseModel = require('./BaseModel');
const db = require('../config/db');

class HizliSatis extends BaseModel {
    static tableName = 'hizli_satislar';

    static async getByKategori(kategori_id) {
        try {
            const query = `
                SELECT 
                    hs.*,
                    k.ad as kategori_adi,
                    u.ad as urun_adi,
                    u.fiyat as urun_fiyati
                FROM ${this.tableName} hs
                LEFT JOIN kategoriler k ON k.id = hs.kategori_id
                LEFT JOIN urunler u ON u.id = hs.urun_id
                WHERE hs.kategori_id = $1
                ORDER BY hs.sira ASC
            `;

            const result = await db.query(query, [kategori_id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByKullanici(kullanici_id) {
        try {
            const query = `
                SELECT 
                    hs.*,
                    k.ad as kategori_adi,
                    u.ad as urun_adi,
                    u.fiyat as urun_fiyati
                FROM ${this.tableName} hs
                LEFT JOIN kategoriler k ON k.id = hs.kategori_id
                LEFT JOIN urunler u ON u.id = hs.urun_id
                WHERE hs.kullanici_id = $1
                ORDER BY hs.tarih DESC
            `;

            const result = await db.query(query, [kullanici_id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByTarih(baslangic_tarihi, bitis_tarihi) {
        try {
            const query = `
                SELECT 
                    hs.*,
                    k.ad as kategori_adi,
                    u.ad as urun_adi,
                    u.fiyat as urun_fiyati,
                    ku.ad as kullanici_adi,
                    ku.soyad as kullanici_soyadi
                FROM ${this.tableName} hs
                LEFT JOIN kategoriler k ON k.id = hs.kategori_id
                LEFT JOIN urunler u ON u.id = hs.urun_id
                LEFT JOIN kullanicilar ku ON ku.id = hs.kullanici_id
                WHERE hs.tarih BETWEEN $1 AND $2
                ORDER BY hs.tarih DESC
            `;

            const result = await db.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getIstatistikler(baslangic_tarihi, bitis_tarihi) {
        try {
            const query = `
                SELECT 
                    COUNT(*) as toplam_satis,
                    SUM(tutar) as toplam_tutar,
                    AVG(tutar) as ortalama_tutar,
                    COUNT(DISTINCT kullanici_id) as toplam_kullanici,
                    COUNT(DISTINCT kategori_id) as toplam_kategori,
                    COUNT(DISTINCT urun_id) as toplam_urun
                FROM ${this.tableName}
                WHERE tarih BETWEEN $1 AND $2
            `;

            const result = await db.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getOzet(id) {
        try {
            const query = `
                SELECT 
                    hs.*,
                    k.ad as kategori_adi,
                    u.ad as urun_adi,
                    u.fiyat as urun_fiyati,
                    ku.ad as kullanici_adi,
                    ku.soyad as kullanici_soyadi,
                    o.ad as odeme_yontemi_adi,
                    i.tutar as indirim_tutari,
                    i.aciklama as indirim_aciklama,
                    ik.miktar as ikram_miktar,
                    ik.aciklama as ikram_aciklama
                FROM ${this.tableName} hs
                LEFT JOIN kategoriler k ON k.id = hs.kategori_id
                LEFT JOIN urunler u ON u.id = hs.urun_id
                LEFT JOIN kullanicilar ku ON ku.id = hs.kullanici_id
                LEFT JOIN odeme_yontemleri o ON o.id = hs.odeme_yontemi_id
                LEFT JOIN indirimler i ON i.hizli_satis_id = hs.id
                LEFT JOIN ikramlar ik ON ik.hizli_satis_id = hs.id
                WHERE hs.id = $1
            `;

            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async fisYazdir(id, yazici_id) {
        try {
            // Fişi yazdırmak için gerekli işlemler burada yapılacak
            // Örneğin: Yazıcıya veri gönderme, fişi oluşturma vb.
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async indirimUygula(id, data) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Hızlı satış kontrolü
            const satisQuery = 'SELECT * FROM hizli_satislar WHERE id = $1';
            const satisResult = await client.query(satisQuery, [id]);

            if (satisResult.rows.length === 0) {
                throw new Error('Hızlı satış bulunamadı');
            }

            // İndirim ekle
            const indirimQuery = `
                INSERT INTO indirimler (
                    hizli_satis_id,
                    indirim_tipi,
                    tutar,
                    aciklama,
                    kullanici_id
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;

            const indirimResult = await client.query(indirimQuery, [
                id,
                data.indirim_tipi,
                data.indirim_tutari,
                data.aciklama,
                data.kullanici_id
            ]);

            // Hızlı satış tutarını güncelle
            const updateQuery = `
                UPDATE hizli_satislar
                SET 
                    tutar = tutar - $1,
                    guncelleme_tarihi = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *
            `;

            const updateResult = await client.query(updateQuery, [
                data.indirim_tutari,
                id
            ]);

            await client.query('COMMIT');

            return {
                ...updateResult.rows[0],
                indirim: indirimResult.rows[0]
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async ikramUygula(id, data) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Hızlı satış kontrolü
            const satisQuery = 'SELECT * FROM hizli_satislar WHERE id = $1';
            const satisResult = await client.query(satisQuery, [id]);

            if (satisResult.rows.length === 0) {
                throw new Error('Hızlı satış bulunamadı');
            }

            // İkram ekle
            const ikramQuery = `
                INSERT INTO ikramlar (
                    hizli_satis_id,
                    urun_id,
                    miktar,
                    aciklama,
                    kullanici_id
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;

            const ikramResult = await client.query(ikramQuery, [
                id,
                data.urun_id,
                data.miktar,
                data.aciklama,
                data.kullanici_id
            ]);

            await client.query('COMMIT');

            return {
                ...satisResult.rows[0],
                ikram: ikramResult.rows[0]
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async updateDurum(id, aktif) {
        try {
            const query = `
                UPDATE ${this.tableName}
                SET 
                    aktif = $1,
                    guncelleme_tarihi = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *
            `;

            const result = await db.query(query, [aktif, id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = HizliSatis; 