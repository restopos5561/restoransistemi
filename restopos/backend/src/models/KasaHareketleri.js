const BaseModel = require('./BaseModel');
const db = require('../config/db');

class KasaHareketleri extends BaseModel {
    static tableName = 'kasa_hareketleri';

    static async getByTarih(baslangic_tarihi, bitis_tarihi) {
        try {
            const query = `
                SELECT 
                    kh.*,
                    k.ad as kullanici_adi,
                    k.soyad as kullanici_soyadi,
                    o.ad as odeme_yontemi_adi
                FROM ${this.tableName} kh
                LEFT JOIN kullanicilar k ON k.id = kh.kullanici_id
                LEFT JOIN odeme_yontemleri o ON o.id = kh.odeme_yontemi_id
                WHERE kh.tarih BETWEEN $1 AND $2
                ORDER BY kh.tarih DESC
            `;

            const result = await db.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByKullanici(kullanici_id) {
        try {
            const query = `
                SELECT 
                    kh.*,
                    o.ad as odeme_yontemi_adi
                FROM ${this.tableName} kh
                LEFT JOIN odeme_yontemleri o ON o.id = kh.odeme_yontemi_id
                WHERE kh.kullanici_id = $1
                ORDER BY kh.tarih DESC
            `;

            const result = await db.query(query, [kullanici_id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByIslemTipi(islem_tipi) {
        try {
            const query = `
                SELECT 
                    kh.*,
                    k.ad as kullanici_adi,
                    k.soyad as kullanici_soyadi,
                    o.ad as odeme_yontemi_adi
                FROM ${this.tableName} kh
                LEFT JOIN kullanicilar k ON k.id = kh.kullanici_id
                LEFT JOIN odeme_yontemleri o ON o.id = kh.odeme_yontemi_id
                WHERE kh.islem_tipi = $1
                ORDER BY kh.tarih DESC
            `;

            const result = await db.query(query, [islem_tipi]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getOzet(baslangic_tarihi = null, bitis_tarihi = null) {
        try {
            let whereClause = '';
            const params = [];

            if (baslangic_tarihi && bitis_tarihi) {
                whereClause = 'WHERE tarih BETWEEN $1 AND $2';
                params.push(baslangic_tarihi, bitis_tarihi);
            }

            const query = `
                SELECT 
                    COUNT(*) as toplam_islem,
                    SUM(CASE WHEN islem_tipi = 'giris' THEN tutar ELSE 0 END) as toplam_giris,
                    SUM(CASE WHEN islem_tipi = 'cikis' THEN tutar ELSE 0 END) as toplam_cikis,
                    SUM(CASE WHEN islem_tipi = 'giris' THEN tutar ELSE -tutar END) as net_bakiye,
                    COUNT(DISTINCT kullanici_id) as toplam_kullanici,
                    COUNT(DISTINCT odeme_yontemi_id) as toplam_odeme_yontemi,
                    COUNT(CASE WHEN aktif = 'beklemede' THEN 1 END) as bekleyen_islem,
                    COUNT(CASE WHEN aktif = 'onaylandi' THEN 1 END) as onaylanan_islem,
                    COUNT(CASE WHEN aktif = 'reddedildi' THEN 1 END) as reddedilen_islem
                FROM ${this.tableName}
                ${whereClause}
            `;

            const result = await db.query(query, params);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateDurum(id, aktif, aciklama) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Kasa hareketi kontrolü
            const hareket = await this.getById(id);
            if (!hareket) {
                throw new Error('Kasa hareketi bulunamadı');
            }

            // aktif güncelleme
            const updateQuery = `
                UPDATE ${this.tableName}
                SET 
                    aktif = $1,
                    durum_aciklama = $2,
                    guncelleme_tarihi = CURRENT_TIMESTAMP
                WHERE id = $3
                RETURNING *
            `;

            const result = await client.query(updateQuery, [aktif, aciklama, id]);

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

module.exports = KasaHareketleri; 