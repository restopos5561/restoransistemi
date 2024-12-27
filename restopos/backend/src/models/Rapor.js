const BaseModel = require('./BaseModel');
const db = require('../config/db');

class Rapor extends BaseModel {
    static tableName = 'raporlar';

    // Satış raporları
    static async getSatisRaporu(baslangic_tarihi, bitis_tarihi) {
        const client = await db.pool.connect();
        try {
            const query = `
                SELECT 
                    COUNT(*) as siparis_sayisi,
                    SUM(toplam_tutar) as toplam_satis,
                    AVG(toplam_tutar) as ortalama_satis,
                    DATE(olusturma_tarihi) as tarih
                FROM siparisler
                WHERE olusturma_tarihi BETWEEN $1 AND $2
                GROUP BY DATE(olusturma_tarihi)
                ORDER BY tarih DESC
            `;
            const result = await client.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Ürün raporları
    static async getUrunRaporu(baslangic_tarihi, bitis_tarihi) {
        const client = await db.pool.connect();
        try {
            const query = `
                SELECT 
                    u.id,
                    u.ad as urun_adi,
                    COUNT(sd.id) as satis_adedi,
                    SUM(sd.miktar) as toplam_miktar,
                    SUM(sd.tutar) as toplam_tutar
                FROM urunler u
                LEFT JOIN siparis_detaylari sd ON sd.urun_id = u.id
                LEFT JOIN siparisler s ON s.id = sd.siparis_id
                WHERE s.olusturma_tarihi BETWEEN $1 AND $2
                GROUP BY u.id, u.ad
                ORDER BY toplam_tutar DESC
            `;
            const result = await client.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Personel raporları
    static async getPersonelRaporu(baslangic_tarihi, bitis_tarihi) {
        const client = await db.pool.connect();
        try {
            const query = `
                SELECT 
                    k.id,
                    k.ad,
                    k.soyad,
                    COUNT(s.id) as siparis_sayisi,
                    SUM(s.toplam_tutar) as toplam_satis
                FROM kullanicilar k
                LEFT JOIN siparisler s ON s.personel_id = k.id
                WHERE s.olusturma_tarihi BETWEEN $1 AND $2
                GROUP BY k.id, k.ad, k.soyad
                ORDER BY toplam_satis DESC
            `;
            const result = await client.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Masa raporları
    static async getMasaRaporu(baslangic_tarihi, bitis_tarihi) {
        const client = await db.pool.connect();
        try {
            const query = `
                SELECT 
                    m.id,
                    m.ad as masa_adi,
                    COUNT(a.id) as adisyon_sayisi,
                    SUM(a.toplam_tutar) as toplam_tutar,
                    AVG(a.toplam_tutar) as ortalama_tutar
                FROM masalar m
                LEFT JOIN adisyonlar a ON a.masa_id = m.id
                WHERE a.olusturma_tarihi BETWEEN $1 AND $2
                GROUP BY m.id, m.ad
                ORDER BY toplam_tutar DESC
            `;
            const result = await client.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Ödeme raporları
    static async getOdemeRaporu(baslangic_tarihi, bitis_tarihi) {
        const client = await db.pool.connect();
        try {
            const query = `
                SELECT 
                    odeme_yontemi,
                    COUNT(*) as islem_sayisi,
                    SUM(tutar) as toplam_tutar
                FROM odemeler
                WHERE olusturma_tarihi BETWEEN $1 AND $2
                GROUP BY odeme_yontemi
                ORDER BY toplam_tutar DESC
            `;
            const result = await client.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Kategori raporları
    static async getKategoriRaporu(baslangic_tarihi, bitis_tarihi) {
        const client = await db.pool.connect();
        try {
            const query = `
                SELECT 
                    k.id,
                    k.ad as kategori_adi,
                    COUNT(sd.id) as satis_adedi,
                    SUM(sd.tutar) as toplam_tutar
                FROM kategoriler k
                LEFT JOIN urunler u ON u.kategori_id = k.id
                LEFT JOIN siparis_detaylari sd ON sd.urun_id = u.id
                LEFT JOIN siparisler s ON s.id = sd.siparis_id
                WHERE s.olusturma_tarihi BETWEEN $1 AND $2
                GROUP BY k.id, k.ad
                ORDER BY toplam_tutar DESC
            `;
            const result = await client.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Stok raporları
    static async getStokRaporu() {
        const client = await db.pool.connect();
        try {
            const query = `
                SELECT 
                    u.id,
                    u.ad as urun_adi,
                    u.stok_miktari,
                    u.kritik_stok_miktari,
                    u.birim,
                    k.ad as kategori_adi
                FROM urunler u
                LEFT JOIN kategoriler k ON k.id = u.kategori_id
                WHERE u.stok_takibi = true
                ORDER BY u.stok_miktari ASC
            `;
            const result = await client.query(query);
            return result.rows;
        } finally {
            client.release();
        }
    }

    // Z raporu
    static async getZRaporu(tarih) {
        const client = await db.pool.connect();
        try {
            const query = `
                SELECT 
                    COUNT(DISTINCT s.id) as siparis_sayisi,
                    COUNT(DISTINCT a.id) as adisyon_sayisi,
                    SUM(s.toplam_tutar) as toplam_satis,
                    (
                        SELECT json_agg(json_build_object(
                            'odeme_yontemi', odeme_yontemi,
                            'toplam', SUM(tutar)
                        ))
                        FROM odemeler
                        WHERE DATE(olusturma_tarihi) = DATE($1)
                        GROUP BY odeme_yontemi
                    ) as odeme_dagilimi,
                    (
                        SELECT json_agg(json_build_object(
                            'kategori', k.ad,
                            'toplam', SUM(sd.tutar)
                        ))
                        FROM kategoriler k
                        LEFT JOIN urunler u ON u.kategori_id = k.id
                        LEFT JOIN siparis_detaylari sd ON sd.urun_id = u.id
                        LEFT JOIN siparisler s ON s.id = sd.siparis_id
                        WHERE DATE(s.olusturma_tarihi) = DATE($1)
                        GROUP BY k.ad
                    ) as kategori_dagilimi
                FROM siparisler s
                LEFT JOIN adisyonlar a ON a.id = s.adisyon_id
                WHERE DATE(s.olusturma_tarihi) = DATE($1)
            `;
            const result = await client.query(query, [tarih]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }
}

module.exports = Rapor; 