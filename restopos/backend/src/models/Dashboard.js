const BaseModel = require('./BaseModel');
const db = require('../config/db');

class Dashboard extends BaseModel {
    static async getOzet() {
        try {
            const query = `
                SELECT
                    (
                        SELECT COUNT(*)
                        FROM adisyonlar
                        WHERE DATE(tarih) = CURRENT_DATE
                    ) as gunluk_adisyon_sayisi,
                    (
                        SELECT COALESCE(SUM(tutar), 0)
                        FROM adisyonlar
                        WHERE DATE(tarih) = CURRENT_DATE
                    ) as gunluk_ciro,
                    (
                        SELECT COUNT(*)
                        FROM odemeler
                        WHERE DATE(tarih) = CURRENT_DATE
                    ) as gunluk_odeme_sayisi,
                    (
                        SELECT COALESCE(SUM(tutar), 0)
                        FROM odemeler
                        WHERE DATE(tarih) = CURRENT_DATE
                    ) as gunluk_tahsilat,
                    (
                        SELECT COUNT(*)
                        FROM masalar
                        WHERE aktif = 'dolu'
                    ) as aktif_masa_sayisi,
                    (
                        SELECT COUNT(*)
                        FROM masalar
                        WHERE aktif = 'bos'
                    ) as bos_masa_sayisi
            `;

            const result = await db.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getGunlukOzet() {
        try {
            const query = `
                SELECT
                    (
                        SELECT COUNT(*)
                        FROM adisyonlar
                        WHERE DATE(tarih) = CURRENT_DATE
                    ) as gunluk_adisyon_sayisi,
                    (
                        SELECT COALESCE(SUM(tutar), 0)
                        FROM adisyonlar
                        WHERE DATE(tarih) = CURRENT_DATE
                    ) as gunluk_ciro,
                    (
                        SELECT COUNT(*)
                        FROM odemeler
                        WHERE DATE(tarih) = CURRENT_DATE
                    ) as gunluk_odeme_sayisi,
                    (
                        SELECT COALESCE(SUM(tutar), 0)
                        FROM odemeler
                        WHERE DATE(tarih) = CURRENT_DATE
                    ) as gunluk_tahsilat,
                    (
                        SELECT COUNT(*)
                        FROM masalar
                        WHERE aktif = 'dolu'
                    ) as aktif_masa_sayisi,
                    (
                        SELECT COUNT(*)
                        FROM masalar
                        WHERE aktif = 'bos'
                    ) as bos_masa_sayisi
            `;

            const result = await db.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getHaftalikOzet() {
        try {
            const query = `
                SELECT
                    (
                        SELECT COUNT(*)
                        FROM adisyonlar
                        WHERE DATE(tarih) >= DATE_TRUNC('week', CURRENT_DATE)
                    ) as haftalik_adisyon_sayisi,
                    (
                        SELECT COALESCE(SUM(tutar), 0)
                        FROM adisyonlar
                        WHERE DATE(tarih) >= DATE_TRUNC('week', CURRENT_DATE)
                    ) as haftalik_ciro,
                    (
                        SELECT COUNT(*)
                        FROM odemeler
                        WHERE DATE(tarih) >= DATE_TRUNC('week', CURRENT_DATE)
                    ) as haftalik_odeme_sayisi,
                    (
                        SELECT COALESCE(SUM(tutar), 0)
                        FROM odemeler
                        WHERE DATE(tarih) >= DATE_TRUNC('week', CURRENT_DATE)
                    ) as haftalik_tahsilat,
                    (
                        SELECT COUNT(DISTINCT cari_id)
                        FROM adisyonlar
                        WHERE DATE(tarih) >= DATE_TRUNC('week', CURRENT_DATE)
                    ) as aktif_musteri_sayisi
            `;

            const result = await db.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAylikOzet() {
        try {
            const query = `
                SELECT
                    (
                        SELECT COUNT(*)
                        FROM adisyonlar
                        WHERE DATE_TRUNC('month', tarih) = DATE_TRUNC('month', CURRENT_DATE)
                    ) as aylik_adisyon_sayisi,
                    (
                        SELECT COALESCE(SUM(tutar), 0)
                        FROM adisyonlar
                        WHERE DATE_TRUNC('month', tarih) = DATE_TRUNC('month', CURRENT_DATE)
                    ) as aylik_ciro,
                    (
                        SELECT COUNT(*)
                        FROM odemeler
                        WHERE DATE_TRUNC('month', tarih) = DATE_TRUNC('month', CURRENT_DATE)
                    ) as aylik_odeme_sayisi,
                    (
                        SELECT COALESCE(SUM(tutar), 0)
                        FROM odemeler
                        WHERE DATE_TRUNC('month', tarih) = DATE_TRUNC('month', CURRENT_DATE)
                    ) as aylik_tahsilat,
                    (
                        SELECT COUNT(DISTINCT cari_id)
                        FROM adisyonlar
                        WHERE DATE_TRUNC('month', tarih) = DATE_TRUNC('month', CURRENT_DATE)
                    ) as aktif_musteri_sayisi
            `;

            const result = await db.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getSatisIstatistikleri() {
        try {
            const query = `
                SELECT 
                    DATE(tarih) as tarih,
                    COUNT(*) as siparis_sayisi,
                    SUM(tutar) as toplam_tutar,
                    AVG(tutar) as ortalama_tutar,
                    COUNT(DISTINCT cari_id) as musteri_sayisi
                FROM adisyonlar
                WHERE DATE_TRUNC('month', tarih) = DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY DATE(tarih)
                ORDER BY tarih DESC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getUrunIstatistikleri() {
        try {
            const query = `
                SELECT 
                    u.id,
                    u.ad,
                    u.fiyat,
                    COUNT(*) as siparis_sayisi,
                    SUM(ak.adet) as toplam_adet,
                    SUM(ak.tutar) as toplam_tutar
                FROM urunler u
                JOIN adisyon_kalemleri ak ON ak.urun_id = u.id
                JOIN adisyonlar a ON a.id = ak.adisyon_id
                WHERE DATE_TRUNC('month', a.tarih) = DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY u.id, u.ad, u.fiyat
                ORDER BY toplam_adet DESC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getPersonelIstatistikleri() {
        try {
            const query = `
                SELECT 
                    k.id,
                    k.ad,
                    k.soyad,
                    COUNT(a.id) as adisyon_sayisi,
                    SUM(a.tutar) as toplam_tutar,
                    AVG(a.tutar) as ortalama_tutar
                FROM kullanicilar k
                LEFT JOIN adisyonlar a ON a.kullanici_id = k.id
                WHERE DATE_TRUNC('month', a.tarih) = DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY k.id, k.ad, k.soyad
                ORDER BY toplam_tutar DESC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getMusteriIstatistikleri() {
        try {
            const query = `
                SELECT 
                    c.id,
                    c.ad,
                    COUNT(a.id) as adisyon_sayisi,
                    SUM(a.tutar) as toplam_tutar,
                    AVG(a.tutar) as ortalama_tutar,
                    MIN(a.tarih) as ilk_siparis,
                    MAX(a.tarih) as son_siparis
                FROM cariler c
                LEFT JOIN adisyonlar a ON a.cari_id = c.id
                WHERE DATE_TRUNC('month', a.tarih) = DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY c.id, c.ad
                ORDER BY toplam_tutar DESC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getMasaIstatistikleri() {
        try {
            const query = `
                SELECT 
                    m.id,
                    m.numara,
                    b.ad as bolge_adi,
                    COUNT(a.id) as adisyon_sayisi,
                    SUM(a.tutar) as toplam_tutar,
                    AVG(a.tutar) as ortalama_tutar,
                    AVG(EXTRACT(EPOCH FROM (a.kapanma_tarihi - a.tarih))/3600) as ortalama_sure
                FROM masalar m
                LEFT JOIN bolgeler b ON b.id = m.bolge_id
                LEFT JOIN adisyonlar a ON a.masa_id = m.id
                WHERE DATE_TRUNC('month', a.tarih) = DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY m.id, m.numara, b.ad
                ORDER BY toplam_tutar DESC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getKuryeIstatistikleri() {
        try {
            const query = `
                SELECT 
                    k.id,
                    k.ad,
                    k.soyad,
                    COUNT(p.id) as paket_sayisi,
                    SUM(p.tutar) as toplam_tutar,
                    AVG(p.tutar) as ortalama_tutar,
                    AVG(EXTRACT(EPOCH FROM (p.teslim_tarihi - p.tarih))/60) as ortalama_sure
                FROM kullanicilar k
                LEFT JOIN paket_siparisler p ON p.kurye_id = k.id AND p.aktif = 'yolda'
                WHERE k.rol = 'kurye'
                GROUP BY k.id, k.ad, k.soyad
                ORDER BY toplam_tutar DESC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByTarihAralik(baslangic_tarihi, bitis_tarihi) {
        try {
            const query = `
                SELECT 
                    DATE(tarih) as tarih,
                    COUNT(*) as siparis_sayisi,
                    SUM(tutar) as toplam_tutar,
                    AVG(tutar) as ortalama_tutar,
                    COUNT(DISTINCT cari_id) as musteri_sayisi
                FROM adisyonlar
                WHERE DATE(tarih) BETWEEN $1 AND $2
                GROUP BY DATE(tarih)
                ORDER BY tarih ASC
            `;

            const result = await db.query(query, [baslangic_tarihi, bitis_tarihi]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getKarsilastirma(baslangic_tarihi1, bitis_tarihi1, baslangic_tarihi2, bitis_tarihi2) {
        try {
            const query1 = `
                SELECT 
                    COUNT(*) as siparis_sayisi,
                    SUM(tutar) as toplam_tutar,
                    AVG(tutar) as ortalama_tutar,
                    COUNT(DISTINCT cari_id) as musteri_sayisi
                FROM adisyonlar
                WHERE DATE(tarih) BETWEEN $1 AND $2
            `;

            const query2 = `
                SELECT 
                    COUNT(*) as siparis_sayisi,
                    SUM(tutar) as toplam_tutar,
                    AVG(tutar) as ortalama_tutar,
                    COUNT(DISTINCT cari_id) as musteri_sayisi
                FROM adisyonlar
                WHERE DATE(tarih) BETWEEN $1 AND $2
            `;

            const result1 = await db.query(query1, [baslangic_tarihi1, bitis_tarihi1]);
            const result2 = await db.query(query2, [baslangic_tarihi2, bitis_tarihi2]);

            return {
                donem1: result1.rows[0],
                donem2: result2.rows[0]
            };
        } catch (error) {
            throw error;
        }
    }

    static async getCanliIstatistikler() {
        try {
            const query = `
                SELECT
                    (
                        SELECT COUNT(*)
                        FROM adisyonlar
                        WHERE kapanma_tarihi IS NULL
                    ) as aktif_adisyon_sayisi,
                    (
                        SELECT COALESCE(SUM(tutar), 0)
                        FROM adisyonlar
                        WHERE kapanma_tarihi IS NULL
                    ) as aktif_adisyon_tutari,
                    (
                        SELECT COUNT(*)
                        FROM masalar
                        WHERE aktif = 'dolu'
                    ) as dolu_masa_sayisi,
                    (
                        SELECT COUNT(*)
                        FROM paket_siparisler
                        WHERE aktif = 'hazirlaniyor'
                    ) as bekleyen_paket_sayisi,
                    (
                        SELECT COUNT(*)
                        FROM paket_siparisler
                        WHERE aktif = 'yolda'
                    ) as yoldaki_paket_sayisi
            `;

            const result = await db.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getCanliSiparisler() {
        try {
            const query = `
                SELECT 
                    a.id,
                    a.masa_id,
                    m.numara as masa_numara,
                    a.tutar,
                    a.tarih,
                    k.ad as garson_ad,
                    k.soyad as garson_soyad
                FROM adisyonlar a
                LEFT JOIN masalar m ON m.id = a.masa_id
                LEFT JOIN kullanicilar k ON k.id = a.kullanici_id
                WHERE a.kapanma_tarihi IS NULL
                ORDER BY a.tarih ASC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getCanliMasaDurumu() {
        try {
            const query = `
                SELECT 
                    m.id,
                    m.numara,
                    m.aktif,
                    b.ad as bolge_adi,
                    a.id as adisyon_id,
                    a.tutar as adisyon_tutar,
                    a.tarih as adisyon_tarih,
                    k.ad as garson_ad,
                    k.soyad as garson_soyad
                FROM masalar m
                LEFT JOIN bolgeler b ON b.id = m.bolge_id
                LEFT JOIN adisyonlar a ON a.masa_id = m.id AND a.kapanma_tarihi IS NULL
                LEFT JOIN kullanicilar k ON k.id = a.kullanici_id
                ORDER BY b.ad ASC, m.numara ASC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getCanliMutfakDurumu() {
        try {
            const query = `
                SELECT 
                    ak.id,
                    ak.adisyon_id,
                    u.ad as urun_adi,
                    ak.adet,
                    ak.tutar,
                    ak.aktif,
                    m.numara as masa_numara,
                    k.ad as garson_ad,
                    k.soyad as garson_soyad,
                    ak.tarih
                FROM adisyon_kalemleri ak
                JOIN urunler u ON u.id = ak.urun_id
                JOIN adisyonlar a ON a.id = ak.adisyon_id
                LEFT JOIN masalar m ON m.id = a.masa_id
                LEFT JOIN kullanicilar k ON k.id = a.kullanici_id
                WHERE ak.aktif = 'beklemede'
                ORDER BY ak.tarih ASC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getCanliKuryeDurumu() {
        try {
            const query = `
                SELECT 
                    k.id,
                    k.ad,
                    k.soyad,
                    k.telefon,
                    COUNT(p.id) FILTER (WHERE p.aktif = 'yolda') as yoldaki_siparis_sayisi,
                    STRING_AGG(
                        CASE 
                            WHEN p.aktif = 'yolda' 
                            THEN p.adres || ' (' || p.tutar || ' TL)'
                            ELSE NULL
                        END,
                        ', '
                    ) as yoldaki_siparisler
                FROM kullanicilar k
                LEFT JOIN paket_siparisler p ON p.kurye_id = k.id AND p.aktif = 'yolda'
                WHERE k.rol = 'kurye'
                GROUP BY k.id, k.ad, k.soyad, k.telefon
                ORDER BY yoldaki_siparis_sayisi DESC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Dashboard; 